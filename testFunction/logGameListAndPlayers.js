const crawlGameSchedule = require("../utils/crawlGameSchedule");
const crawlPlayerEntry = require("../utils/crawlPlayerEntry");
const crawlPlayersInfo = require("../utils/crawlPlayersInfo");
const crawlgameResult = require("../utils/crawlGameResult");

(async () => {
  try {
    const gameList = await crawlGameSchedule(20210410);
    console.dir(gameList, { depth: null });

    const players = await crawlPlayerEntry(gameList);
    console.dir(players, { depth: null });

    const playersWithInfo = await crawlPlayersInfo(players);
    console.dir(playersWithInfo, { depth: null });

    const gameResults = await crawlgameResult(
      gameList.map((game) => game.gameId)
    );
    console.dir(gameResults);
  } catch (err) {
    console.log(err);
  }
})();

// test: node testFunction/logGameListAndPlayers.js
