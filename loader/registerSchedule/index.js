const schedule = require("node-schedule-tz");
const {
  preparationTime,
  weekdayGameOpenTime,
  weekdayGameCloseTime,
  saturdayGameOpenTime,
  saturdayGameCloseTime,
  sundayGameOpenTime,
  sundayGameCloseTime,
} = require("./scheduleTimes");
const prepareGame = require("../../services/scheduling/prepareGame");
const openGame = require("../../services/scheduling/openGame");
const closeGame = require("../../services/scheduling/closeGame");

const logger = require("../../config/winston");

exports.prepareGameTime = schedule.scheduleJob(preparationTime, prepareGame);

exports.weekdayOpen = schedule.scheduleJob(weekdayGameOpenTime, openGame);
exports.saturdayOpen = schedule.scheduleJob(saturdayGameOpenTime, openGame);
exports.sundayOpen = schedule.scheduleJob(sundayGameOpenTime, openGame);

exports.weekdayClose = schedule.scheduleJob(weekdayGameCloseTime, closeGame);
exports.saturdayClose = schedule.scheduleJob(saturdayGameCloseTime, closeGame);
exports.sundayClose = schedule.scheduleJob(sundayGameCloseTime, closeGame);

exports.logTime = schedule.scheduleJob("*/10 * * * * *", () => {
  logger.info(new Date().toUTCString());
});
