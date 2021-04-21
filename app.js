require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/users");
const gameRouter = require("./routes/games");

const authenticateUser = require("./middlewares/authenticateUser");

const connectMongoDB = require("./config/connectMongoDB");

connectMongoDB();

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: "http://localhost:3000",
}));

app.use("/users", usersRouter);
app.use("/games", authenticateUser, gameRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({ result: "failure" });
});

module.exports = app;
