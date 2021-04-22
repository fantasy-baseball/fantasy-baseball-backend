const express = require("express");
const gamesController = require("../controllers/games.controller");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.get("/:game_date/schedule", gamesController.getSchedule);
router.get("/:game_date/players", gamesController.getPlayers);
router.post("/:game_date/betting", authenticateUser, gamesController.postBetting);

module.exports = router;
