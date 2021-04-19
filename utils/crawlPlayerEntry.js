/**
 * Get players from some games.
 *
 * @params {Object[]}
 * - The games that have gameId, seasonId, leagueId, and seriesId.
 * @returns {Object}
 * -{
 *    result: boolean,
 *    data: [
 *       {
 *         team: 한화,
 *         name: 류현진,
 *         position: 투수,
 *       },
 *       ...
 *    ],
 *  }
 *
 * example:
 * const entry = await crawlPlayerEntry([
 *   {
 *     gameId: '20210417WOKT0',
 *     leagueId: 1,
 *     seriesId: 0,
 *     seasonId: 2021,
 *     date: '20210417',
 *     time: '17:00',
 *     stadium: '수원',
 *     home: 'KT',
 *     away: '키움',
 *     homePitcher: '데스파이네 ',
 *     awayPitcher: '안우진 '
 *   },
 *   ...
 * ]);
 */

const puppeteer = require("puppeteer");
const { KBO_GAME_CENTER_URL } = require("../constants/crawling");

const crawlPlayerEntry = async (gameList) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(KBO_GAME_CENTER_URL);

  const entryResponse = await page.evaluate(async (games) => {
    try {
      const result = [];

      for (let i = 0; i < games.length; i += 1) {
        const {
          leagueId,
          seriesId,
          seasonId,
          gameId,
        } = games[i];

        result.push(
          $.ajax({
            type: "post",
            url: "/ws/Schedule.asmx/GetLineUpAnalysis",
            dataType: "json",
            data: {
              leId: leagueId,
              srId: seriesId,
              seasonId,
              gameId,
            },
          })
        );
      }

      return {
        result: true,
        data: await Promise.all(result),
      };
    } catch (err) {
      return {
        result: false,
        errorLocation: "getEntry",
        message: err.responseText,
      };
    }
  }, gameList);

  if (!entryResponse.result) {
    return entryResponse;
  }

  const entryList = await page.evaluate(async ({ data: entryRes }, games) => {
    const result = [];

    for (let i = 0; i < entryRes.length; i += 1) {
      const entry = entryRes[i];

      const homeTeam = entry[1][0].T_NM;
      const awayTeam = entry[2][0].T_NM;

      if (entry[0][0].LINEUP_CK) {
        const homeTeamEntry = JSON.parse(entry[3][0]).rows;
        const awayTeamEntry = JSON.parse(entry[4][0]).rows;

        for (let j = 0; j < homeTeamEntry.length; j += 1) {
          result.push({
            team: homeTeam,
            name: homeTeamEntry[j].row[2].Text,
            position: homeTeamEntry[j].row[1].Text,
          });
        }

        const { homePitcher } = games.find((game) => game.home === homeTeam);
        result.push({
          team: homeTeam,
          name: homePitcher,
          position: "투수",
        });

        for (let j = 0; j < awayTeamEntry.length; j += 1) {
          result.push({
            team: awayTeam,
            name: awayTeamEntry[j].row[2].Text,
            position: awayTeamEntry[j].row[1].Text,
          });
        }

        const { awayPitcher } = games.find((game) => game.home === homeTeam);
        result.push({
          team: awayTeam,
          name: awayPitcher,
          position: "투수",
        });
      }
    }

    return result;
  }, entryResponse, gameList);

  await browser.close();

  return {
    result: true,
    data: entryList,
  };
};

module.exports = crawlPlayerEntry;
