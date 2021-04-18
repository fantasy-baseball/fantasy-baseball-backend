const express = require("express");
const usersController = require("../controllers/users.controller");

const router = express.Router();

router.get("/login", usersController.login);

module.exports = router;
