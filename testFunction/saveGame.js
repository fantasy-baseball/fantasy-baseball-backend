const crawlGameSchedule = require("../utils/crawlGameSchedule");
const crawlPlayerEntry = require("../utils/crawlPlayerEntry");
const crawlPlayersInfo = require("../utils/crawlPlayersInfo");
const Game = require("../models/Game");
const Player = require("../models/Player");

module.exports = async (dateNumber) => {
  let dateString = dateNumber;
  if (typeof dateString !== "string") {
    dateString = dateNumber.toString();
  }

  try {
    const gameList = await crawlGameSchedule(dateNumber);
    console.log("get gameList");
    const players = await crawlPlayerEntry(gameList);
    console.log("get playerEntry");
    const playersWithInfo = await crawlPlayersInfo(players);
    console.log("get playersInfo");

    const newPlayers = [];
    for (let i = 0; i < playersWithInfo.length; i += 1) {
      newPlayers.push(
        Player.findOneAndUpdate(
          { kboId: playersWithInfo[i].kboId },
          playersWithInfo[i],
          {
            new: true,
            upsert: true,
          }
        )
      );
    }

    console.log("update Players");

    const playersId = (await Promise.all(newPlayers))
      .map((player) => player._id);

    const year = Number(dateString.slice(0, 4));
    const month = Number(dateString.slice(4, 6)) - 1;
    const date = Number(dateString.slice(6, 8));
    const createdAt = new Date(year, month, date, 4, 0);
    // scheduling simulation
    // TODO: delete

    await Game.create({
      createdAt,
      gameDate: dateString,
      players: playersId,
      schedule: gameList,
    });
  } catch (err) {
    console.log(err);
  }
};

/*
in app.js

const saveGame = require("./testTrigger/saveGame");

(async () => {
  await saveGame();
  console.log("complete");
})();

*/
