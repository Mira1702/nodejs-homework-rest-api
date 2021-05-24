const mongoose = require("mongoose");
const { Schema } = mongoose;
const { USER } = requier("../helpers/constans");
const bcrypt = requier("bcryptjs");
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
    enum: [USER.STARTER, USER.PRO, USER.BUSINESS],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(SALT_FACTOR);
  this.password = await bcrypt.hash(this.passwodr, salt);
  next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
