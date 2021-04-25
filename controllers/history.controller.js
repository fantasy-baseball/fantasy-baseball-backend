const createError = require("http-errors");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Statistics = require("../models/Statistic");
const User = require("../models/User");
const UserBettingData = require("../models/UserBettingData");

exports.getUserRankings = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const userRankings = await UserBettingData.find(
      { gameDate },
      "roaster earnedMoney bettingMoney user"
    )
      .sort({ rank: 1 })
      .populate({
        path: "roaster",
        select: "team "
      })
      .lean();

    res.status(200).json({
      result: "ok",
      data: userRankings,
    });
  } catch (err) {
    next(createError(500, "error"));
  }
};
