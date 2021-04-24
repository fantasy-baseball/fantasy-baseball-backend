const puppeteer = require("puppeteer");
const { KBO_GAME_CENTER_URL } = require("../constants/crawling");
const makeQueryString = require("./makeQueryString");

const groupSummaryByPlayers = (gameSummaries) => {
  const result = [];
  const findPlayerName = /.*?\(.*?\)/g;
  const findBracket = /\(.*\)/g;
  const findRecordCount = /\d+$/g;

  for (let i = 0; i < gameSummaries.length; i += 1) {
    const groupedSummary = {};
    const gameSummary = Object.entries(gameSummaries[i]);

    for (let j = 0; j < gameSummary.length; j += 1) {
      const [recordName, recordedPlayersString] = gameSummary[j];

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

          if (!groupedSummary[player]) {
            groupedSummary[player] = [];
          }

          for (let l = 0; l < recordCount; l += 1) {
            groupedSummary[player].push(recordName);
          }
        }
      }
    }

    result.push(groupedSummary);
  }

  return result;
};

const crawlGameResults = async (gameIds) => {
  const browser = await puppeteer.launch();

  let pages = [];
  for (let i = 0; i < gameIds.length; i += 1) {
    pages.push(browser.newPage());
  }

  pages = await Promise.all(pages);

  const playerInfoPages = [];
  for (let i = 0; i < gameIds.length; i += 1) {
    const page = pages[i];
    const queryString = makeQueryString({
      gameDate: gameIds[i].slice(0, 8),
      gameId: gameIds[i],
      section: "REVIEW",
    });

    playerInfoPages.push(
      page.goto(KBO_GAME_CENTER_URL + queryString)
    );
  }

  await Promise.all(playerInfoPages);

  const isPagesLoaded = [];
  for (let i = 0; i < gameIds.length; i += 1) {
    const page = pages[i];

    isPagesLoaded.push(page.waitForSelector(".sub-tit", { timeout: 10000 }));
  }

  try {
    await Promise.all(isPagesLoaded);
  } catch (err) {
    throw new Error("Can't load review page");
  }

  let gameSummaries = [];
  for (let i = 0; i < gameIds.length; i += 1) {
    const page = pages[i];

    gameSummaries.push(page.evaluate(() => {
      const gameSummary = {};
      const $records = document.querySelectorAll(".summary tr");
      const exceptionKeys = ["심판", "홈런", "2루타", "3루타"];

      for (let j = 0; j < $records.length; j += 1) {
        const record = $records[j];
        const recordName = record.children[0].textContent.trim();
        const recordedPlayersString = record.children[1].textContent.trim();

        if (!exceptionKeys.includes(recordName)) {
          gameSummary[recordName] = recordedPlayersString;
        }
      }

      return gameSummary;
    }));
  }

  gameSummaries = await Promise.all(gameSummaries);
  const gameSummariesByPlayers = groupSummaryByPlayers(gameSummaries);

  let playersRecords = [];
  for (let i = 0; i < gameIds.length; i += 1) {
    const page = pages[i];

    playersRecords.push(page.evaluate(() => {
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
    }));
  }

  playersRecords = await Promise.all(playersRecords);

  const result = [];
  for (let i = 0; i < gameIds.length; i += 1) {
    const gameId = gameIds[i];
    const gameSummary = gameSummariesByPlayers[i];
    const playersRecord = playersRecords[i];

    result.push({
      gameId,
      gameSummary,
      playersRecord,
    });
  }

  await browser.close();

  return result;
};

module.exports = crawlGameResults;
