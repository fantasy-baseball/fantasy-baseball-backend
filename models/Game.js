const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  userPlayData: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
  }],
  schedule: [{
    gameId: {
      type: String,
      required: true,
    },
    leagueId: {
      type: Number,
      required: true,
    },
    seriesId: {
      type: Number,
      required: true,
    },
    seasonId: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    stadium: {
      type: String,
      required: true,
    },
    home: {
      type: String,
      required: true,
    },
    away: {
      type: String,
      required: true,
    },
    homePitcher: {
      type: String,
      trim: true,
    },
    awayPitcher: {
      type: String,
      trim: true,
    },
  }],
  totalMoney: Number,
  totalScore: Number,
  isOpened: Boolean,
});

module.exports = mongoose.model("Game", gameSchema);
