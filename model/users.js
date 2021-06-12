const User = require("../schemas/user");

const findById = async (id) => {
  return await User.finedOne({ _id: id });
};

const findByEmail = async (email) => {
  return await User.finedOne({ email });
};

const create = async (options) => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscription = async (id, body) => {
  const result = await User.findByIdAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  );
  return result;
};

const updateUserAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateSubscription,
  updateUserAvatar,
};
