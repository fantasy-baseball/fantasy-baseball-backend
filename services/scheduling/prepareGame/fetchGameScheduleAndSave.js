const Game = require("../../../models/Game");
const fetchGameSchedule = require("../../fetchGameInfoFromKBO/fetchGameSchedule");

module.exports = async (dateString) => {
  try {
    console.log(dateString, "Preparation start");

    const gameList = await fetchGameSchedule(dateString);
    console.log(`${dateString} Today game schedule crawling`);

    await Game.create({
      gameDate: dateString,
      schedule: gameList,
      createdAt: new Date(),
    });

    console.log(`${dateString} Game document is created`);
  } catch (err) {
    console.error(err);
  }
};
