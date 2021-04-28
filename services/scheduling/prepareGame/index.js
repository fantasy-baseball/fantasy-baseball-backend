const { startSession } = require("mongoose");
const { format, subDays } = require("date-fns");
const fetchGameScheduleAndSave = require("./fetchGameScheduleAndSave");
const fetchGameResultAndSave = require("./fetchGameResultAndSave");
const {
  calculateBettingMoney,
  sumEarnedMoneyWithUserMoney,
  setBettingRankings,
} = require("../../../utils/calculateBettingMoney");
const updateHitterScore = require("../../../utils/updateHitterScore");
const updatePitcherScore = require("../../../utils/updatePitcherScore");
const updateTotalScore = require("../../../utils/updateTotalScore");

module.exports = async () => {
  try {
    const dateString = format(new Date(), "yyyyMMdd");
    const yesterdayDateString = format(
      subDays(new Date(), 1),
      "yyyyMMdd"
    );

    console.log("heellohellovanilal");

    // await fetchGameScheduleAndSave(dateString);
    // await fetchGameResultAndSave(yesterdayDateString);
    // console.log("fetch today schedule, yesterday result");

    const updateScoreSession = await startSession();
    updateScoreSession.startTransaction();

    const updateScoreResult = [
      await updateHitterScore("20210420", updateScoreSession),
      await updatePitcherScore("20210420", updateScoreSession),
      await updateTotalScore("20210420", updateScoreSession),
    ].every((result) => result);

    if (updateScoreResult) {
      await updateScoreSession.commitTransaction();
    } else {
      await updateScoreSession.abortTransaction();
    }

    updateScoreSession.endSession();
    console.log(`update score, result: ${updateScoreResult}`);

    // await calculateBettingMoney(yesterdayDateString);
    // await sumEarnedMoneyWithUserMoney(yesterdayDateString);
    // await setBettingRankings(yesterdayDateString);
    // console.log("update money");
  } catch (err) {
    console.error(err);
  }
};
