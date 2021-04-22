const createError = require("http-errors");
const Game = require("../models/Game");
const Statistics = require("../models/Statistic");
require("../models/Player");

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

exports.getPlayers = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const game = await Game.findOne({ gameDate })
      .populate("players")
      .lean();

    if (!game) {
      next(createError(
        404,
        "Can't find Game that corresponds to the game_date"
      ));
      return;
    }

    let statistics = [];
    const { players } = game;
    for (let i = 0; i < players.length; i += 1) {
      const playerId = players[i]._id;

      statistics.push(
        Statistics.findOne({
          gameDate,
          player: playerId
        }).lean()
      );
    }

    statistics = await Promise.all(statistics);

    for (let i = 0; i < players.length; i += 1) {
      const player = players[i];
      const { position } = statistics[i];
      player.position = position;
    }

    res.status(200).json({
      result: "ok",
      data: players,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};
