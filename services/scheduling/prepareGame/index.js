const { format, subDays } = require("date-fns");
const fetchGameScheduleAndSave = require("./fetchGameScheduleAndSave");
const {
  calculateBettingMoney,
  sumEarnedMoneyWithUserMoney,
  setBettingRankings,
} = require("../../../utils/calculateBettingMoney");

module.exports = async () => {
  try {
    const dateString = format(new Date(), "yyyyMMdd");
    const yesterdayDateString = format(
      subDays(new Date(), 1),
      "yyyyMMdd"
    );

    await fetchGameScheduleAndSave(dateString);

    await calculateBettingMoney(yesterdayDateString);
    await sumEarnedMoneyWithUserMoney(yesterdayDateString);
    await setBettingRankings(yesterdayDateString);
  } catch (err) {
    console.error(err);
  }
};
