const schedule = require("node-schedule-tz");
const {
  preparationTime,
  weekdayGameOpenTime,
  saturdayGameOpenTime,
  sundayGameOpenTime,
} = require("./scheduleTimes");
const prepageGame = require("../services/scheduling/prepareGame");
const openGame = require("../services/scheduling/openGame");

exports.prepareGameTime = schedule.scheduleJob(preparationTime, prepageGame);
exports.weekdayOpen = schedule.scheduleJob(weekdayGameOpenTime, openGame);
exports.saturdayOpen = schedule.scheduleJob(saturdayGameOpenTime, openGame);
exports.sundayOpen = schedule.scheduleJob(sundayGameOpenTime, openGame);
