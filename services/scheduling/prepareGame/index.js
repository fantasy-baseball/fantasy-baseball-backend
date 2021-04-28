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

    await fetchGameScheduleAndSave(dateString);
    await fetchGameResultAndSave(yesterdayDateString);
    console.log("fetch today schedule, yesterday result");

    await updateHitterScore(yesterdayDateString);
    await updatePitcherScore(yesterdayDateString);
    await updateTotalScore(yesterdayDateString);
    console.log("update score");

    await calculateBettingMoney(yesterdayDateString);
    await sumEarnedMoneyWithUserMoney(yesterdayDateString);
    await setBettingRankings(yesterdayDateString);
    console.log("update money");
  } catch (err) {
    console.error(err);
  }
};
