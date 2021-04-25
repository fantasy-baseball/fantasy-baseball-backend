const createError = require("http-errors");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Statistics = require("../models/Statistic");
const User = require("../models/User");
const UserBettingData = require("../models/UserBettingData");
const { PLAYER_POSITION } = require("../constants/game");

exports.getUserRankings = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const userRankings = await UserBettingData.find(
      { gameDate },
      "roaster earnedMoney bettingMoney user rank"
    )
      .sort({ rank: 1 })
      .populate({
        path: "user",
        select: "name email",
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

exports.getRoaster = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const { email } = res.locals.profile;

    const user = await User.findOne({ email });
    const bettingData = await UserBettingData.findOne(
      { gameDate, user: user._id },
      "roaster"
    ).populate({
      path: "roaster",
      select: "name team playerPhotoUrl statistics",
      populate: {
        path: "statistics",
        match: {
          gameDate
        },
        select: "position score totalBettingMoney",
      }
    }).lean();

    const roaster = {};
    bettingData.roaster.forEach((player) => {
      const position = PLAYER_POSITION[player.statistics[0].position];
      roaster[position] = {
        name: player.name,
        team: player.team,
        playerPhotoUrl: player.playerPhotoUrl,
        position: player.statistics[0].position,
        score: player.statistics[0].score,
        totalBettingMoney: player.statistics[0].totalBettingMoney,
      };
    });

    res.status(200).json({
      result: "ok",
      data: roaster,
    });
  } catch (err) {
    console.error(err);
    next(createError(500, "error"));
  }
};
