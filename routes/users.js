const express = require("express");
const usersController = require("../controllers/users.controller");

const router = express.Router();

router.get("/login", usersController.login);
router.get("/logout", usersController.logout);

module.exports = router;
