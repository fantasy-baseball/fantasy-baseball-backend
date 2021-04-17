const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  date: {
    type: Date,
    require: true,
  },
  user_play_data: [{ type: mongoose.Schema.Types.ObjectId }],
  players: [{ type: mongoose.Schema.Types.ObjectId }],
  schedule: Array,
  total_money: Number,
  total_score: Number,
  is_opend: Boolean,
});

module.exports = mongoose.model("Game", gameSchema);
