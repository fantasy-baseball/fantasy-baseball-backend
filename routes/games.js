const express = require("express");
const gamesController = require("../controllers/games.controller");

const router = express.Router();

router.get("/:game_date/schedule", gamesController.getSchedule);
router.get("/:game_date/players", gamesController.getPlayers);

module.exports = router;
