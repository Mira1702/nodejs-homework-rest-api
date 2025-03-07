const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const boolParser = require("express-query-boolean");
const helmet = require("helmet");
// const limiter = require("./helpers/limiter");

const { HttpCode } = require("./helpers/constans");

const contactsRouter = require("./routes/api/contacts/index");
const usersRouter = require("./routes/api/users/index");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

require("dotenv").config();
app.use(express.static("public"));

app.use(helmet());
// app.use(limiter);
// app.use(logger(formatsLogger));
app.get("env") !== "test" && app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: 15000 }));
app.use(boolParser());

app.use("/api/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: "error", code: HttpCode.NOT_FOUND, message: "Not found" });
});

app.use((error, req, res, next) => {
  const code = error.status || HttpCode.INTERNAL_SERVER_ERROR;
  const status = error.status ? "error" : "fail";
  res.status(code).json({ status, code, message: error.message });
});

module.exports = app;
