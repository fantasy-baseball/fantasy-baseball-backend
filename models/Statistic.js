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
  totalScore: {
    type: Number,
    default: 0,
  },
  playerMoney: {
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
    }
  }],
  scorePercentage: {
    type: Number,
    default: 0,
  },
  gameDate: String,
});

module.exports = mongoose.model("Statistic", statisticSchema);
