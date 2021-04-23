const mongoose = require("mongoose");

const userBettingDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bettingMoney: {
    type: Number,
    required: true,
  },
  roaster: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  }],
  earnedMoney: Number,
  rank: Number,
  isCalculated: {
    type: Boolean,
    required: true,
    default: false,
  }
});

module.exports = mongoose.model("UserBettingData", userBettingDataSchema);
