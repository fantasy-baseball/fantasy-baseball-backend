const { startSession } = require("mongoose");
const { format } = require("date-fns");
const Game = require("../../../models/Game");
const Player = require("../../../models/Player");
const Statistic = require("../../../models/Statistic");
const fetchPlayerEntry = require("../../fetchGameInfoFromKBO/fetchPlayerEntry");
const fetchPlayersInfo = require("../../fetchGameInfoFromKBO/fetchPlayersInfo");

module.exports = async () => {
  const session = await startSession();

  try {
    session.startTransaction();

    const dateString = format(new Date(), "yyyyMMdd");

    const currentGame = await Game
      .findOne(
        { gameDate: dateString },
        "schedule",
        { session }
      );

    console.log(`Load ${dateString} game`);

    if (currentGame.schedule.length === 0) {
      throw new Error("fetch error : there is no game schedule");
    }

    const { schedule: gameList } = currentGame;

    const players = await fetchPlayerEntry(gameList);
    if (players.length === 0) {
      throw new Error("fetch error : there is no players");
    }

    console.log("get playerEntry");
    console.log(`players ${players.length}`);

    const playersWithInfo = await fetchPlayersInfo(players);
    if (playersWithInfo.length === 0) {
      throw new Error("fetch error : there is no player informations");
    }

    console.log("get playersInfo");
    console.log(`playersInfo ${playersWithInfo.length}`);

    const newPlayers = await Promise.all(
      playersWithInfo.map((player) => (
        Player.findOneAndUpdate(
          { kboId: player.kboId },
          {
            team: player.team,
            name: player.name,
            link: player.link,
            kboId: player.kboId,
            playerPhotoUrl: player.playerPhotoUrl,
            backNumber: player.backNumber,
            role: player.role,
          },
          {
            new: true,
            upsert: true,
            session,
          }
        )
      ))
    );

    const playerIds = newPlayers.map((player) => player._id);

    const newStatistics = await Promise.all(
      playersWithInfo.map((player) => (
        Statistic.findOneAndUpdate(
          {
            team: player.team,
            name: player.name,
            position: player.position,
            gameDate: dateString,
          },
          {
            name: player.name,
            team: player.team,
            position: player.position,
            playerType: player.position,
            gameDate: dateString,
          },
          {
            new: true,
            upsert: true,
            session,
          }
        )
      ))
    );

    const statisticIds = newStatistics.map((statistics) => statistics._id);

    const playersWithStatisticId = [];
    const statisticsWithPlayerId = [];
    for (let i = 0; i < newPlayers.length; i += 1) {
      const newPlayer = newPlayers[i];
      const newStatistic = newStatistics[i];
      const playerId = playerIds[i];
      const statisticsId = statisticIds[i];

      playersWithStatisticId.push(
        newPlayer.updateOne(
          {
            $push: {
              statistics: statisticsId,
            }
          },
          { session }
        )
      );

      statisticsWithPlayerId.push(
        newStatistic.updateOne(
          { playerId },
          { session }
        )
      );
    }

    await Promise.all(playersWithStatisticId);
    await Promise.all(statisticsWithPlayerId);

    await currentGame.updateOne(
      {
        players: playerIds,
        isOpened: true,
      },
      { session }
    );

    console.log("open game complete");

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
  }
};
