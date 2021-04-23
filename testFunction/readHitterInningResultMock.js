const fs = require("fs");
const path = require("path");
const util = require("util");

const readFile = util.promisify(fs.readFile);

const mockDirPath = path.join(
  __dirname, "../mock/prevSeasonData/hitterInningResults"
);

const readHitterInningResultMock = async () => {
  const mockFileNameList = fs.readdirSync(mockDirPath);
  const mockFileList = [];

  for (let i = 0; i < mockFileNameList.length; i += 1) {
    const mockFileName = mockFileNameList[i];
    if (mockFileName !== ".DS_Store") {
      mockFileList.push(
        readFile(`${mockDirPath}/${mockFileName}`)
      );
    }
  }

  try {
    const fileList = await Promise.all(mockFileList);

    const gameResults = fileList
      .map((file) => JSON.parse(file))
      .map((gameResult) => gameResult.playersRecord)
      .flatMap((teamPlayerRecord) => Object.values(teamPlayerRecord))
      .map((playersRecord) => playersRecord.hitters)
      .flatMap((hittersRecord) => Object.values(hittersRecord))
      .flatMap((hitterRecord) => hitterRecord.record)
      .filter((inningRecord) => !!inningRecord)
      .flatMap((inningRecord) => {
        let records = inningRecord.split("/");
        records = records.map((record) => record.trim());

        return records;
      })
      .sort((a, b) => {
        const longLength = Math.max(a.length, b.length);

        for (let i = 1; i <= longLength; i += 1) {
          if (a[a.length - i] > b[b.length - i]) {
            return 1;
          }

          if (a[a.length - i] < b[b.length - i]) {
            return -1;
          }
        }

        return 0;
      });

    const inningResult = [...new Set(gameResults)];
    for (let i = 0; i < inningResult.length; i += 1) {
      console.log(inningResult[i]);
    }
  } catch (err) {
    console.error(err);
  }
};

readHitterInningResultMock();

// exec: node testFunction/readHitterInningResultMock.js
