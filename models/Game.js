const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  user_play_data: [{ type: mongoose.Schema.Types.ObjectId }],
  players: [{ type: mongoose.Schema.Types.ObjectId }],
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
    homePitcher: String,
    awayPitcher: String,
  }],
  total_money: Number,
  total_score: Number,
  is_opened: Boolean,
});

module.exports = mongoose.model("Game", gameSchema);
