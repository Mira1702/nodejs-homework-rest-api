const express = require("express");
const router = express.Router();
const guard = require("../../../helpers/guard");
const cntrl = require("../../../controllers/contacts");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("./validation");

router.get("/", guard, cntrl.getAll);

router.get("/:contactId", guard, validateObjectId, cntrl.getById);

router.post("/", guard, validateCreateContact, cntrl.create);

router.delete("/:contactId", guard, validateObjectId, cntrl.remove);

router.patch(
  "/:contactId",
  guard,
  validateUpdateContact,
  validateObjectId,
  cntrl.update
);

router.patch(
  "/:contactId/favorite",
  guard,
  validateUpdateStatusContact,
  validateObjectId,
  cntrl.updateFavourite
);

module.exports = router;
