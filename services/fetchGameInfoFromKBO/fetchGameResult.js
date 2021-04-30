const puppeteer = require("puppeteer");
const { KBO_GAME_CENTER_URL } = require("../../constants/kboUrl");
const makeQueryString = require("../../utils/makeQueryString");
const logger = require("../../config/winston");

const groupSummaryByPlayers = (gameSummary) => {
  const findPlayerName = /.*?\(.*?\)/g;
  const findBracket = /\(.*\)/g;
  const findRecordCount = /\d+$/g;

  const result = {};
  const playersByRecord = Object.entries(gameSummary);

  for (let j = 0; j < playersByRecord.length; j += 1) {
    const [recordName, recordedPlayersString] = playersByRecord[j];

    let recordedPlayers = recordedPlayersString
      .match(findPlayerName);

    if (recordedPlayers) {
      recordedPlayers = recordedPlayers.map((player) => (
        player
          .trim()
          .replace(findBracket, "")
      ));

      for (let k = 0; k < recordedPlayers.length; k += 1) {
        let player = recordedPlayers[k];

        const recordCount = Number(player.match(findRecordCount)) || 1;
        if (recordCount) {
          player = player.replace(findRecordCount, "");
        }

        if (!result[player]) {
          result[player] = [];
        }

        for (let l = 0; l < recordCount; l += 1) {
          result[player].push(recordName);
        }
      }
    }
  }

  return result;
};

const fetchGameResult = async (gameIds) => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const results = [];

  for (let i = 0; i < gameIds.length; i += 1) {
    try {
      const gameId = gameIds[i];

      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(1200000);
      logger.info(`Log: open ${i} th page`);

      const queryString = makeQueryString({
        gameDate: gameId.slice(0, 8),
        gameId,
        section: "REVIEW",
      });
      await page.goto(KBO_GAME_CENTER_URL + queryString);
      await page.waitForSelector(".sub-tit", { timeout: 10000 });
      logger.info(`Log: page goes ${gameId} game review page`);

      const gameSummary = await page.evaluate(() => {
        const collectedGameSummary = {};
        const $records = document.querySelectorAll(".summary tr");
        const exceptionKeys = ["심판", "홈런", "2루타", "3루타"];

        for (let j = 0; j < $records.length; j += 1) {
          const record = $records[j];
          const recordName = record.children[0].textContent.trim();
          const recordedPlayersString = record.children[1].textContent.trim();

          if (!exceptionKeys.includes(recordName)) {
            collectedGameSummary[recordName] = recordedPlayersString;
          }
        }

        return collectedGameSummary;
      });

      logger.info(`Log: get ${gameId} game summary`);

      const playersRecord = await page.evaluate(() => {
        const $game = document.querySelector(".list-review.on");
        const awayTeam = $game.attributes.away_nm.value;
        const homeTeam = $game.attributes.home_nm.value;

        const getElemsTextContent = ($elems) => (
          Array.from($elems).map(($elem) => $elem.textContent.trim())
        );

        const awayPositions = getElemsTextContent(
          document.querySelectorAll("#tblAwayHitter1 tbody tr th:nth-child(2)")
        );
        const homePositions = getElemsTextContent(
          document.querySelectorAll("#tblHomeHitter1 tbody tr th:nth-child(2)")
        );

        const awayHitters = getElemsTextContent(
          document.querySelectorAll("#tblAwayHitter1 tbody tr td")
        );
        const homeHitters = getElemsTextContent(
          document.querySelectorAll("#tblHomeHitter1 tbody tr td")
        );

        const $awayHitterRecordRows = document.querySelectorAll("#tblAwayHitter2 tbody tr");
        const $awayHitterRecordSummaryRows = document.querySelectorAll("#tblAwayHitter3 tbody tr");
        const $homeHitterRecordRows = document.querySelectorAll("#tblHomeHitter2 tbody tr");
        const $homeHitterRecordSummaryRows = document.querySelectorAll("#tblHomeHitter3 tbody tr");

        const $awayPitcherRecordRows = document.querySelectorAll("#awayPitRecord tbody tr");
        const $homePitcherRecordRows = document.querySelectorAll("#homePitRecord tbody tr");

        const getHittersRecord = (
          hitterNames,
          hitterPositions,
          hitterTeam,
          $hittersRecordRows,
          $hittersRecordSummaryRows
        ) => {
          const result = {};
          const hitterNamesCount = {};

          for (let j = 0; j < hitterNames.length; j += 1) {
            let hitterName = hitterNames[j];
            const hitterPosition = hitterPositions[j];
            hitterNamesCount[hitterName] = hitterNamesCount[hitterName] + 1 || 1;

            const hitterInningRecords = Array.from(
              $hittersRecordRows[j].children
            ).map(($hitterInningRecord) => {
              const recordContent = $hitterInningRecord.textContent.trim();
              if (!recordContent) {
                return null;
              }

              return recordContent;
            });

            if (hitterNamesCount[hitterName] >= 2) {
              hitterName += hitterNamesCount[hitterName];
            }

            result[hitterName] = {
              team: hitterTeam,
              position: hitterPosition,
              record: [null, ...hitterInningRecords],
            };

            const hitterRecordSummaryContents = Array.from(
              $hittersRecordSummaryRows[j].children
            ).map(($hitterRecordSummaryContent) => (
              $hitterRecordSummaryContent.textContent.trim()
            ));

            const hitterRecordSummary = {
              atBats: hitterRecordSummaryContents[0],
              hits: hitterRecordSummaryContents[1],
              runsBattedIn: hitterRecordSummaryContents[2],
              runsScored: hitterRecordSummaryContents[3],
              battingAverage: hitterRecordSummaryContents[4],
            };

            result[hitterName].summary = hitterRecordSummary;
          }

          return result;
        };

        const getPitchersRecord = ($pitchersRecordRows, pitcherTeam) => {
          const result = {};

          const keys = [
            "name",
            "onMound",
            "result",
            "win",
            "lose",
            "save",
            "inning",
            "hitter",
            "pitchCount",
            "timesAtBat",
            "hits",
            "homerun",
            "baseOnBalls",
            "strikeOuts",
            "runs",
            "earnedRuns",
            "earnedRunAverage",
          ];

          for (let j = 0; j < $pitchersRecordRows.length; j += 1) {
            const $pitchersRecordRow = $pitchersRecordRows[j];
            const pitcherName = $pitchersRecordRow.children[0].textContent.trim();
            const pitcherInfo = {};

            pitcherInfo.team = pitcherTeam;
            pitcherInfo.record = {};

            for (let k = 1; k < $pitchersRecordRow.children.length; k += 1) {
              const pitchersRecordContent = $pitchersRecordRow.children[k].textContent.trim();
              pitcherInfo.record[keys[k]] = pitchersRecordContent;
            }

            result[pitcherName] = pitcherInfo;
          }

          return result;
        };

        const awayHittersRecord = getHittersRecord(
          awayHitters,
          awayPositions,
          awayTeam,
          $awayHitterRecordRows,
          $awayHitterRecordSummaryRows
        );
        const homeHittersRecord = getHittersRecord(
          homeHitters,
          homePositions,
          homeTeam,
          $homeHitterRecordRows,
          $homeHitterRecordSummaryRows
        );

        const awayPitchersRecord = getPitchersRecord(
          $awayPitcherRecordRows,
          awayTeam
        );
        const homePitchersRecord = getPitchersRecord(
          $homePitcherRecordRows,
          homeTeam
        );

        return {
          hitters: { ...awayHittersRecord, ...homeHittersRecord },
          pitchers: { ...awayPitchersRecord, ...homePitchersRecord },
        };
      });

      logger.info(`Log: get ${gameId} players record`);

      const gameSummaryByPlayers = groupSummaryByPlayers(gameSummary);

      results.push({
        gameId,
        gameSummary: gameSummaryByPlayers,
        playersRecord
      });

      await page.close();
    } catch (err) {
      if (err.name === "TimeoutError") {
        logger.error(`Can't load ${gameIds[i]} review page`);
      } else {
        logger.error(err);
      }
    }
  }

  await browser.close();

  return results;
};

module.exports = fetchGameResult;
