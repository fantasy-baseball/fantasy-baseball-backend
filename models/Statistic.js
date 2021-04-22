const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
  },
  record: Array,
  position: {
    type: String,
    trim: true,
  },
  totalScore: Number,
  playerMoney: Number,
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  scorePercentage: Number,
  gameDate: String,
});

module.exports = mongoose.model("Statistic", statisticSchema);
