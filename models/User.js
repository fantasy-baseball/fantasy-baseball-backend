const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  image_url: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
