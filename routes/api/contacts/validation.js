const Joi = require("joi");
const mongoose = require("mongoose");

const { HttpCode } = require("../../../helpers/constans");

const schemaCreateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  phone: Joi.string().required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .optional(),
});

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const validate = async (schema, body, next) => {
  try {
    await schema.validateAsync(body);
    next();
  } catch (error) {
    next({
      status: 400,
      message: `Field: ${error.message.replace(/"/g, "")}`,
    });
  }
};

const validateId = async (id, next) => {
  if (await mongoose.isValidObjectId(id)) {
    next();
    return;
  }
  next({
    status: HttpCode.BAD_REQUEST,
    message: `Id is not valid`,
  });
};

module.exports.validateCreateContact = (req, _res, next) => {
  return validate(schemaCreateContact, req.body, next);
};

module.exports.validateUpdateContact = (req, _res, next) => {
  return validate(schemaUpdateContact, req.body, next);
};

module.exports.validateUpdateStatusContact = (req, _res, next) => {
  return validate(schemaUpdateStatusContact, req.body, next);
};

module.exports.validateObjectId = (req, _res, next) => {
  return validateId(req.params.contactId, next);
};
