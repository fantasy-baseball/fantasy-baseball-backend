const createError = require("http-errors");
const checkBettingOpened = require("../utils/index");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Statistics = require("../models/Statistic");
const User = require("../models/User");
const UserBettingData = require("../models/UserBettingData");

exports.getSchedule = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;
    const game = await Game.findOne({ gameDate }).lean();

    if (!game) {
      res.status(404).json({
        result: "none",
        data: [],
      });
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
    const { players } = await Game
      .findOne(
        { gameDate },
        "players"
      )
      .populate({
        path: "players",
        populate: {
          path: "statistics",
          match: {
            gameDate,
          },
          select: "position",
        },
      })
      .lean();

    if (!players) {
      res.status(404).json({
        result: "none",
        data: [],
      });
      return;
    }

    const playersWithPosition = players.map((player) => {
      const { position } = player.statistics[0];
      const { statistics: removed, ...refinedPlayer } = player;

      refinedPlayer.position = position;

      return refinedPlayer;
    });

    res.status(200).json({
      result: "ok",
      data: playersWithPosition,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.postBetting = async (req, res, next) => {
  try {
    const { email } = res.locals.profile;
    const { date, roaster, bettingMoney } = req.body;

    const roasterWithKboId = await Promise.all(
      roaster.map((id) => Player.findOne({ kboId: id }, "_id"))
    );
    const roasterWithId = roasterWithKboId.map((object) => object._id);

    const user = await User.findOne({ email });
    const userBettingData = await UserBettingData.findOne({ user: user._id });

    if (userBettingData) {
      res.status(409).json({
        result: "duplicate",
        message: "Can't save user play data because data already exists",
      });
      return;
    }

    const isBettingOpened = checkBettingOpened(new Date());

    if (isBettingOpened === false) {
      res.status(403).json({
        result: "close",
        message: "Betting is closed",
      });
      return;
    }

    const newBettingData = await UserBettingData.create({
      user: user._id,
      bettingMoney,
      roaster: roasterWithId,
    });

    await Game.findOneAndUpdate(
      { gameDate: date },
      {
        $push: {
          userBettingData: newBettingData,
        },
        $inc: {
          totalMoney: bettingMoney,
        },
      }
    );

    await User.findOneAndUpdate(
      { email },
      {
        $inc: {
          money: -bettingMoney
        },
      }
    );

    res.status(201).json({ result: "ok" });
  } catch (err) {
    next(createError(500, err.message));
  }
};

exports.getBettingData = async (req, res, next) => {
  try {
    const gameDate = req.params.game_date;

    const todayGame = await Game.findOne({ gameDate });
    const { userBettingData, totalMoney } = todayGame;

    res.status(200).json({
      result: "ok",
      data: {
        users: userBettingData,
        totalMoney,
      },
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};
