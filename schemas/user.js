const mongoose = require("mongoose");
const { Schema } = mongoose;
const { Subscription } = require("../helpers/constans");
const bcrypt = require("bcryptjs");
const SALT_FACTOR = 6;

const UserSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.passwodr, salt);
  }
  next();
});

UserSchema.method.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};

const User = mongoose.model("user", UserSchema);

module.exports = User;
