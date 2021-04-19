const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  team: {
    type: String,
    required: true,
    trim: true,
  },
  backNumber: {
    type: Number,
  },
  playerType: {
    type: String,
    enum: ["hitter", "pitcher"],
    required: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
  },
  playerPhotoUrl: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
  },
  kboId: String,
  statistics: [{
    record: Array,
    totalScore: Number,
    playerMoney: Number,
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    scorePercentage: Number,
    date: Date,
  }],
});

module.exports = mongoose.model("Player", playerSchema);
