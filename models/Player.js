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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Statistic",
  }],
});

module.exports = mongoose.model("Player", playerSchema);
