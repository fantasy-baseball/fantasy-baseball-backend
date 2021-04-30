const { startSession } = require("mongoose");
const { format, subDays } = require("date-fns");
const fetchGameScheduleAndSave = require("./fetchGameScheduleAndSave");
const fetchGameResultAndSave = require("./fetchGameResultAndSave");
const updateHitterScore = require("./updateHitterScore");
const updatePitcherScore = require("./updatePitcherScore");
const updateTotalScore = require("./updateTotalScore");
const updateEarnedMoney = require("./updateEarnedMoney");
const updateUserMoney = require("./updateUserMoney");
const updateUserRankings = require("./updateUserRankings");
const logger = require("../../../config/winston");

module.exports = async () => {
  try {
    // const dateString = format(new Date(), "yyyyMMdd");
    // const yesterdayDateString = format(
    //   subDays(new Date(), 1),
    //   "yyyyMMdd"
    // );

    const dateString = "20210424";
    const yesterdayDateString = "20210423";

    logger.info(`Start: prepare ${dateString} game`);

    await fetchGameScheduleAndSave(dateString);

    const isFetchGameResultComplete = await fetchGameResultAndSave(yesterdayDateString);
    if (!isFetchGameResultComplete) {
      return;
    }

    const updateScoreSession = await startSession();
    await updateScoreSession.withTransaction(async () => {
      await updateHitterScore(yesterdayDateString, updateScoreSession);
      await updatePitcherScore(yesterdayDateString, updateScoreSession);
      await updateTotalScore(yesterdayDateString, updateScoreSession);
    });
    updateScoreSession.endSession();

    const updateUserSession = await startSession();
    await updateUserSession.withTransaction(async () => {
      await updateEarnedMoney(yesterdayDateString, updateUserSession);
      await updateUserMoney(yesterdayDateString, updateUserSession);
      await updateUserRankings(yesterdayDateString, updateUserSession);
    });
    updateUserSession.endSession();

    logger.info("End: prepare game");
  } catch (err) {
    logger.error(err);
  }
};
