const jwt = require("jsonwebtoken");
require("dotenv").config();
const Users = require("../model/users");
const { HttpCode } = require("../helpers/constans");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
const LocalUploadAvatar = require("../services/avatars-local");
const EmailService = require("../services/email");
const CreateSenderSendgrid = require("../services/email-sender");

const signup = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: "error",
        code: HttpCode.CONFLICT,
        message: "Email in use",
      });
    }
    const newUser = await Users.create(req.body);
    const { id, name, email, subscription } = newUser;
    return res.status(HttpCode.CREATED).json({
      status: "success",
      code: HttpCode.CREATED,
      data: { user: { id, name, email, subscription } },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isValidPassword = await user?.validPassword(password);

    if (!user || !isValidPassword) {
      return res.status(HttpCode.UNAUTORIZED).json({
        status: "error",
        code: HttpCode.UNAUTORIZED,
        message: "Email or password is wrong",
      });
    }
    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "2h" });
    await Users.updateToken(user.id, token);
    const { id, name, subscription } = user;
    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        token,
        user: {
          id,
          name,
          email,
          subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Users.updateToken(userId, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const { name, email, subscription } = req.user;
    return res.status(HttpCode.OK).json({
      status: "success ",
      code: HttpCode.OK,
      data: {
        name,
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const subscription = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const contact = await Users.updateSubscription(userId, req.body);
    const { name, email, subscription } = contact;
    return res.status(HttpCode.OK).json({
      status: "success ",
      code: HttpCode.OK,
      data: {
        name,
        email,
        subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new LocalUploadAvatar(AVATARS_OF_USERS);
    const avatarUrl = await uploads.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatarURL,
    });
    await Users.updateUserAvatar(id, avatarUrl);
    return res.json({
      status: "success",
      code: httpCode.OK,
      data: { avatarUrl },
    });
  } catch (e) {
    next(e);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerificationToken(
      req.params.verificationToken
    );
    if (user) {
      await Users.updateVerificationToken(user.id, true, null);
      return res.status(httpCode.OK).json({
        status: "success",
        code: httpCode.OK,
        message: "Verification successful",
      });
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: "error",
      code: httpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (e) {
    next(e);
  }
};

const resendEmailForVerify = async (req, res, next) => {
  const user = await Users.findUserByEmail(req.body.email);
  if (user) {
    const { email, subscription, verificationToken, isVerify } = user;
    if (!isVerify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendgrid()
        );
        await emailService.sendEmail(verificationToken, email, subscription);
        return res.status(httpCode.OK).json({
          status: "success",
          code: httpCode.OK,
          message: "Verification email sent",
        });
      } catch (e) {
        return next(e);
      }
    }
    return res.status(httpCode.CONFLICT).json({
      status: "error",
      code: httpCode.CONFLICT,
      message: "Verification has already been passed",
    });
  }
  return res.status(httpCode.NOT_FOUND).json({
    status: "error",
    code: httpCode.NOT_FOUND,
    message: "User not found",
  });
};

module.exports = {
  signup,
  login,
  logout,
  current,
  subscription,
  avatars,
  verify,
  resendEmailForVerify,
};
