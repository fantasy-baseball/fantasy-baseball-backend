const schedule = require("node-schedule-tz");
const {
  prepareGameTime,
  weekdayOpenGame,
  saturdayOpenGame,
  sundayOpenGame,
} = require("./scheduleTimer");
const prepageGame = require("./prepareGame");
const openGame = require("./openGame");

exports.prepareGameTime = schedule.scheduleJob(prepareGameTime, prepageGame);

exports.weekdayOpen = schedule.scheduleJob(weekdayOpenGame, openGame);
exports.saturdayOpen = schedule.scheduleJob(saturdayOpenGame, openGame);
exports.sundayOpen = schedule.scheduleJob(sundayOpenGame, openGame);
