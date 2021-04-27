const { format, subDays } = require("date-fns");
const Game = require("../../../models/Game");

const crawlGameSchedule = require("../../../utils/crawlGameSchedule");
const {
  calculateBettingMoney,
  sumEarnedMoneyWithUserMoney,
  setBettingRankings,
} = require("../../../utils/calculateBettingMoney");

module.exports = async () => {
  try {
    const dateString = format(new Date(), "yyyyMMdd");
    console.log(dateString, "prepageGame");

    const yesterdayDateString = format(
      subDays(new Date(), 1),
      "yyyyMMdd"
    );

    const gameList = await crawlGameSchedule(dateString);
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
