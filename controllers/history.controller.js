const createError = require("http-errors");
const User = require("../models/User");
const UserBettingData = require("../models/UserBettingData");
const { PLAYER_POSITION } = require("../constants/game");

exports.getUserRankings = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const userRankings = await UserBettingData
      .find(
        { gameDate },
        "roaster earnedMoney bettingMoney user rank"
      )
      .sort({ rank: 1 })
      .populate({
        path: "user",
        select: "name email",
      })
      .lean();

    if (userRankings === null) {
      res.status(404).json({
        result: "none",
        data: [],
      });
      return;
    }

    res.status(200).json({
      result: "ok",
      data: userRankings,
    });
  } catch (err) {
    next(createError(500, "Fail to get userRankings"));
  }
};

exports.getRoaster = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const { email } = res.locals.profile;

    const user = await User.findOne({ email });
    const bettingData = await UserBettingData
      .findOne(
        { gameDate, user: user._id },
        "roaster"
      )
      .populate({
        path: "roaster",
        select: "name team playerPhotoUrl statistics",
        populate: {
          path: "statistics",
          match: {
            gameDate
          },
          select: "position score totalBettingMoney",
        }
      })
      .lean();

    if (bettingData === null) {
      res.status(404).json({
        result: "none",
        data: [],
      });
      return;
    }

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
    next(createError(500, "Fail to get user roaster"));
  }
};

exports.getBettingHistory = async (req, res, next) => {
  try {
    const { email } = res.locals.profile;

    const { _id: userId } = await User.findOne({ email });
    const userBettingHistory = await UserBettingData
      .find({
        user: userId,
      })
      .sort({ gameDate: -1 })
      .populate({
        path: "roaster",
      })
      .lean();

    if (userBettingHistory.length === 0) {
      next(createError(404, "Can't find user betting history"));
      return;
    }

    res.status(200).json({
      result: "ok",
      data: userBettingHistory,
    });
  } catch (err) {
    console.log(err.message);
    next(createError(500, "Fail to get betting history"));
  }
};
