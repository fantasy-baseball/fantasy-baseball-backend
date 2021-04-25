const fs = require("fs");
const path = require("path");
const util = require("util");

const readFile = util.promisify(fs.readFile);

const mockDirPath = path.join(
  __dirname, "../mock/prevSeasonData/hitterInningResults"
);

const readMockFiles = async () => {
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

    return fileList;
  } catch (err) {
    console.error(err);
  }
};

const collectInningRecords = async () => {
  const fileList = await readMockFiles();

  let inningRecords = fileList
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

  inningRecords = [...new Set(inningRecords)];

  for (let i = 0; i < inningRecords.length; i += 1) {
    console.log(inningRecords[i]);
  }
};

const collectSpecialRecords = async () => {
  const fileList = await readMockFiles();

  let specialRecords = fileList
    .map((file) => JSON.parse(file))
    .map((gameResult) => gameResult.gameSummary)
    .flatMap((gameSummary) => Object.values(gameSummary))
    .flat();

  specialRecords = [...new Set(specialRecords)];

  console.log(specialRecords);
};

collectSpecialRecords();

// exec: node testFunction/readHitterInningResultMock.js
