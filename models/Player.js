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
  back_number: {
    type: Number,
  },
  player_type: {
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
  player_photo_url: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
  },
  kbo_id: String,
  statistic_data: Array,
});

module.exports = mongoose.model("Player", playerSchema);
