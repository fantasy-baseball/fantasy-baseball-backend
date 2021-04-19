const crawlGameSchedule = require("../utils/crawlGameSchedule");
const crawlPlayerEntry = require("../utils/crawlPlayerEntry");
const crawlPlayersInfo = require("../utils/crawlPlayersInfo");

(async () => {
  try {
    const gameList = await crawlGameSchedule(20210417);
    console.dir(gameList, { depth: null });

    const players = await crawlPlayerEntry(gameList);
    console.dir(players, { depth: null });

    const playersWithInfo = await crawlPlayersInfo(players);
    console.dir(playersWithInfo, { depth: null });
  } catch (err) {
    console.log(err);
  }
})();

// test: node testTrigger/logGameListAndPlayers.js
