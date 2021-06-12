const express = require("express");
const router = express.Router();
const guard = require("../../../helpers/guard");
const cntrl = require("../../../controllers/users.js");
const {
  validateSignup,
  validateLogin,
  validateStatusSubscription,
} = require("./validation");

router.post("/signup", validateSignup, cntrl.signup);
router.post("/login", validateLogin, cntrl.login);
router.post("/logout", guard, cntrl.logout);
router.get("/current", guard, ctrl.current);
router.patch("/", guard, validateStatusSubscription, ctrl.subscription);
router.patch(
  "/avatars",
  [guard, upload.single("avatarURL")],
  controllers.avatars
);

module.exports = router;
