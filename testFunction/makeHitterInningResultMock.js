const fs = require("fs");
const path = require("path");
const util = require("util");
const crawlGameSchedule = require("../utils/crawlGameSchedule");
const crawlGameResults = require("../utils/crawlGameResult");

const writeFile = util.promisify(fs.writeFile);

const gameSchedulesDir = path.join(
  __dirname, "../mock/prevSeasonData/gameSchedules"
);
const hitterInningResultsDir = path.join(
  __dirname, "../mock/prevSeasonData/hitterInningResults"
);

const getNextDateString = (dateString, number) => {
  const year = Number(dateString.slice(0, 4));
  const month = Number(dateString.slice(4, 6)) - 1;
  const date = Number(dateString.slice(6, 8));

  const newDate = new Date(year, month, date);
  newDate.setDate(newDate.getDate() + number);

  let newDateString = newDate.getDate();
  newDateString = newDateString < 10
    ? `0${newDateString.toString()}`
    : newDateString.toString();
  let newMonthString = newDate.getMonth() + 1;
  newMonthString = newMonthString < 10
    ? `0${newMonthString.toString()}`
    : newMonthString.toString();

  const newYearString = newDate.getFullYear().toString();
  return newYearString + newMonthString + newDateString;
};

const makeHitterInningResultMock = async (gameDateString) => {
  if (typeof gameDateString !== "string") {
    throw new Error("gameDateString must be string");
  }

  try {
    const gameSchedule = await crawlGameSchedule(gameDateString);

    console.log("get schedule");

    const gameScheduleJson = JSON.stringify(gameSchedule);
    const gameIds = gameSchedule.map((game) => game.gameId);

    await writeFile(
      `${gameSchedulesDir}/${gameDateString}.json`,
      gameScheduleJson
    );

    console.log("save game schedule!");

    const gameResults = await crawlGameResults(gameIds);
    console.log("get gameResults");

    const gameResultFiles = [];
    for (let i = 0; i < gameResults.length; i += 1) {
      const gameResult = gameResults[i];
      const gameResultJson = JSON.stringify(gameResult);

      const { gameId } = gameResult;

      gameResultFiles.push(
        writeFile(
          `${hitterInningResultsDir}/${gameId}.json`,
          gameResultJson
        )
      );
    }

    await Promise.all(gameResultFiles);
  } catch (err) {
    console.log(err);
  }
};

const saveGameDataContinuously = async (startDateString, endDateString, dayStep) => {
  try {
    let currentDateString = startDateString;
    while (currentDateString !== endDateString) {
      await makeHitterInningResultMock(currentDateString);
      console.log(`${currentDateString} complete`);

      currentDateString = getNextDateString(currentDateString, dayStep);
    }
  } catch (err) {
    console.error(err);
  }
};

saveGameDataContinuously("20210422", "20210420", -1);

// exec: node testFunction/makeHitterInningResultMock.js
