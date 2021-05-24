const express = require("express");
const router = express.Router();
// const Contacts = require("../../../model/index");
const cntrl = require("../../../controllers/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("./validation");

router.get("/", cntrl.getAll);

router.get("/:contactId", cntrl.getById);

router.post("/", validateCreateContact, cntrl.create);

router.delete("/:contactId", cntrl.remove);

router.patch("/:contactId", validateUpdateContact, cntrl.update);

router.patch(
  "/:contactId/favorite",
  validateUpdateStatusContact,
  cntrl.updateFavourite
);

module.exports = router;
