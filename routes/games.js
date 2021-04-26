const express = require("express");
const gamesController = require("../controllers/games.controller");
const historyController = require("../controllers/history.controller");
const authenticateUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.get("/:game_date/schedule", gamesController.getSchedule);
router.get("/:game_date/players", gamesController.getPlayers);
router.get("/:game_date/betting", gamesController.getBettingData);
router.post("/:game_date/betting", authenticateUser, gamesController.postBetting);

router.get("/:game_date/rankings/users", historyController.getUserRankings);
router.get("/:game_date/rankings/positions", historyController.getPositionRankings);
router.get("/:game_date/roaster", authenticateUser, historyController.getRoaster);

module.exports = router;
