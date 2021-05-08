// const fs = require("fs/promises");
// const contacts = require("./contacts.json");
const db = require("./db");
const { v4: uuid } = require("uuid");

const listContacts = async () => {
  return db.get("contacts").value();
};

const getContactById = async (contactId) => {};

const removeContact = async (contactId) => {};

const addContact = async (body) => {
  const contactId = uuid();
  const record = {
    contactId,
    ...body,
  };
  db.get("contacts").push(record).write();
  return record;
};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
