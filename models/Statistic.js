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
  score: {
    type: Number,
    default: 0,
  },
  totalBettingMoney: {
    type: Number,
    default: 0,
  },
  users: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bettingMoney: {
      type: Number,
      default: 0,
    },
    _id: false,
  }],
  scorePercentage: {
    type: Number,
    default: 0,
  },
  gameDate: String,
});

module.exports = mongoose.model("Statistic", statisticSchema);
