const schedule = require("node-schedule-tz");
const {
  preparationTime,
  weekdayGameOpenTime,
  saturdayGameOpenTime,
  sundayGameOpenTime,
} = require("./scheduleTimes");
const prepareGame = require("../services/scheduling/prepareGame");
const openGame = require("../services/scheduling/openGame");

exports.prepareGameTime = schedule.scheduleJob(preparationTime, prepareGame);
exports.weekdayOpen = schedule.scheduleJob(weekdayGameOpenTime, openGame);
exports.saturdayOpen = schedule.scheduleJob(saturdayGameOpenTime, openGame);
exports.sundayOpen = schedule.scheduleJob(sundayGameOpenTime, openGame);
