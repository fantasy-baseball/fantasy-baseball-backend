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

const makeHitterInningResultMock = async (startDateString, daysNumber) => {
  if (typeof startDateString !== "string") {
    throw new Error("startDateString must be string");
  }

  let currentDateString = startDateString;

  let gameSchedules = [];
  const dateStrings = [];
  for (let i = 0; i < daysNumber; i += 1) {
    gameSchedules.push(
      crawlGameSchedule(currentDateString)
    );

    console.log(currentDateString);
    dateStrings.push(currentDateString);
    currentDateString = getNextDateString(currentDateString, -1);
  }

  try {
    gameSchedules = await Promise.all(gameSchedules);
  } catch (err) {
    console.error("get schedule error!");
  }

  console.log("get schedule!");

  const gameIds = [];
  const gameSchedulesFiles = [];
  for (let i = 0; i < gameSchedules.length; i += 1) {
    const gameSchedule = gameSchedules[i];
    const gameScheduleJson = JSON.stringify(gameSchedule);

    for (let j = 0; j < gameSchedule.length; j += 1) {
      const { gameId } = gameSchedule[j];
      gameIds.push(gameId);
    }

    gameSchedulesFiles.push(
      writeFile(`${gameSchedulesDir}/${dateStrings[i]}.json`, gameScheduleJson)
    );
  }

  try {
    await Promise.all(gameSchedulesFiles);
    console.log("save game schedule!");

    const gameResults = await crawlGameResults(gameIds);
    console.log("get gameResults");

    const gameResultsFiles = [];
    for (let i = 0; i < gameResults.length; i += 1) {
      const gameResult = gameResults[i];
      const gameResultJson = JSON.stringify(gameResult);

      const { gameId } = gameResult;

      gameResultsFiles.push(
        writeFile(
          `${hitterInningResultsDir}/${gameId}.json`,
          gameResultJson
        )
      );
    }

    await Promise.all(gameResultsFiles);
  } catch (err) {
    console.error(err.message);
  }

  return getNextDateString(
    dateStrings[dateStrings.length - 1],
    -1
  );
};

(async () => {
  let nextDateString = "20201124";
  while (true) {
    nextDateString = await makeHitterInningResultMock(nextDateString, 1);
  }
})();

// test: node testFunction/makeHitterInningResultMock.js
