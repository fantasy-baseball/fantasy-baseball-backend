const createError = require("http-errors");
const Game = require("../models/Game");

exports.getSchedule = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const game = await Game.findOne({ gameDate }).lean();

    if (!game) {
      next(createError(
        404,
        "Can't find Game that corresponds to the game_date"
      ));
      return;
    }

    res.status(200).json({
      result: "ok",
      data: game.schedule,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};
