const { format, subDays } = require("date-fns");
const Game = require("../../../models/Game");

const fetchGameSchedule = require("../../fetchGameInfoFromKBO/fetchGameSchedule");
const {
  calculateBettingMoney,
  sumEarnedMoneyWithUserMoney,
  setBettingRankings,
} = require("../../../utils/calculateBettingMoney");

module.exports = async () => {
  try {
    const dateString = format(new Date(), "yyyyMMdd");
    console.log(dateString, "Preparation start");

    const yesterdayDateString = format(
      subDays(new Date(), 1),
      "yyyyMMdd"
    );

    const gameList = await fetchGameSchedule(dateString);
    console.log(`${dateString} Today game schedule crawling`);

    await Game.create({
      gameDate: dateString,
      schedule: gameList,
      createdAt: new Date(),
    });

    console.log(`${dateString} Game document is created`);

    await calculateBettingMoney(yesterdayDateString);
    await sumEarnedMoneyWithUserMoney(yesterdayDateString);
    await setBettingRankings(yesterdayDateString);
  } catch (err) {
    console.log(err);
  }
};
