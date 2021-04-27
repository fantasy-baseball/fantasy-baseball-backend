const schedule = require("node-schedule-tz");
const {
  prepareGameTime,
  weekdayOpenGame,
  saturdayOpenGame,
  sundayOpenGame,
} = require("./scheduleTimes");
const prepageGame = require("../services/scheduling/prepareGame");
const openGame = require("../services/scheduling/openGame");

exports.prepareGameTime = schedule.scheduleJob(prepareGameTime, prepageGame);

exports.weekdayOpen = schedule.scheduleJob(weekdayOpenGame, openGame);
exports.saturdayOpen = schedule.scheduleJob(saturdayOpenGame, openGame);
exports.sundayOpen = schedule.scheduleJob(sundayOpenGame, openGame);
