const createError = require("http-errors");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Statistics = require("../models/Statistic");
const User = require("../models/User");
const UserBettingData = require("../models/UserBettingData");
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
          player: playerId,
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

    const bettingData = await UserBettingData.create({
      user: user._id,
      bettingMoney,
      roaster: roasterWithId,
    });

    await Game.findOneAndUpdate(
      { gameDate: date },
      {
        $push: {
          userBettingData: bettingData,
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
