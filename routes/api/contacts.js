const express = require("express");
const router = express.Router();
const Contacts = require("../../model/index");
const {
  validateCreateContact,
  validateUpdateContact,
  validateUpdateStatusContact,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res
      .status(200)
      .json({ status: "success", code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", validateCreateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.addContact();
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, message: "contact deleted" });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId", validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body
    );
    if (contact) {
      return res
        .status(200)
        .json({ status: "success", code: 200, data: { contact } });
    }
    return res
      .status(404)
      .json({ status: "error", code: 404, message: "Not Found" });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/:contactId/favorite",
  validateUpdateStatusContact,
  async (req, res, next) => {
    try {
      const contact = await contactsModel.updateStatusContact(
        req.params.contactId,
        req.body
      );

      if (contact) {
        return res.status(200).json({
          status: "success",
          code: 200,
          data: { contact },
        });
      } else {
        return next({
          status: 404,
          message: "missing field favorite",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
