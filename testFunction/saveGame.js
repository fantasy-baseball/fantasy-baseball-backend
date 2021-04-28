const crawlGameSchedule = require("../utils/crawlGameSchedule");
const crawlPlayerEntry = require("../utils/crawlPlayerEntry");
const crawlPlayersInfo = require("../utils/crawlPlayersInfo");
const Game = require("../models/Game");
const Player = require("../models/Player");
const Statistic = require("../models/Statistic");

const saveGame = async (dateNumber) => {
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

    let newPlayers = [];
    for (let i = 0; i < playersWithInfo.length; i += 1) {
      const {
        team,
        name,
        link,
        kboId,
        playerPhotoUrl,
        backNumber,
        role,
      } = playersWithInfo[i];

      newPlayers.push(
        Player.findOneAndUpdate(
          { kboId: playersWithInfo[i].kboId },
          {
            team,
            name,
            link,
            kboId,
            playerPhotoUrl,
            backNumber,
            role,
          },
          {
            new: true,
            upsert: true,
          }
        )
      );
    }

    newPlayers = await Promise.all(newPlayers);
    const playersIds = newPlayers.map((player) => player._id);

    let newStatistics = [];
    for (let i = 0; i < playersWithInfo.length; i += 1) {
      const {
        name,
        team,
        position,
        playerType,
      } = playersWithInfo[i];

      newStatistics.push(Statistic.findOneAndUpdate(
        {
          team,
          name,
          position,
          gameDate: dateString
        },
        {
          name,
          team,
          position,
          playerType,
          gameDate: dateString,
        },
        {
          new: true,
          upsert: true,
        }
      ));
    }

    newStatistics = await Promise.all(newStatistics);
    const statisticIds = newStatistics.map((statistics) => statistics._id);

    const playersWithStatisticId = [];
    const statisticsWithPlayerId = [];
    for (let i = 0; i < newPlayers.length; i += 1) {
      const newPlayer = newPlayers[i];
      const newStatistic = newStatistics[i];
      const playerId = playersIds[i];
      const statisticsId = statisticIds[i];

      playersWithStatisticId.push(
        newPlayer.updateOne(
          {
            $push: {
              statistics: statisticsId,
            }
          }
        )
      );

      statisticsWithPlayerId.push(
        newStatistic.updateOne(
          { playerId }
        )
      );
    }

    await Promise.all(playersWithStatisticId);
    await Promise.all(statisticsWithPlayerId);

    console.log("update Players");

    const year = Number(dateString.slice(0, 4));
    const month = Number(dateString.slice(4, 6)) - 1;
    const date = Number(dateString.slice(6, 8));
    const createdAt = new Date(year, month, date, 4, 0);
    // scheduling simulation
    // TODO: delete

    await Game.create({
      createdAt,
      gameDate: dateString,
      players: playersIds,
      schedule: gameList,
    });

    console.log("update Game");
  } catch (err) {
    console.log(err);
  }
};

module.exports = saveGame;

/*
in app.js

const saveGame = require("./testFunction/saveGame");

(async () => {
  await saveGame();
  console.log("complete");
})();

*/
