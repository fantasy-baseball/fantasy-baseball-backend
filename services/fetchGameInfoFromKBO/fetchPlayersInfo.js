const puppeteer = require("puppeteer");
const { KBO_PLAYER_SEARCH_URL } = require("../../constants/kboUrl");
const logger = require("../../config/winston");

const fetchPlayersInfo = async (players) => {
  const results = [];

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  for (let i = 0; i < players.length; i += 1) {
    const player = players[i];

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    logger.info(`Log: open ${i} th page`);

    await page.goto(KBO_PLAYER_SEARCH_URL + player.name);
    logger.info(`Log: page goes to ${i} th player search page`);

    const link = await page.evaluate((toBeMatchedPlayer) => {
      const $rows = document.querySelectorAll(".tEx tBody > tr");

      for (let j = 0; j < $rows.length; j += 1) {
        const $row = $rows[j];

        const backNumber = $row.children[0].textContent.trim();
        const name = $row.children[1].textContent.trim();
        const team = $row.children[2].textContent.trim();

        const isMatched = (
          backNumber !== "#"
            && toBeMatchedPlayer.name === name
            && toBeMatchedPlayer.team === team
        );

        if (isMatched) {
          return $row.children[1].children[0].href;
        }
      }

      return null;
    }, player);
    logger.info(`Log: get ${i} th player info link`);

    if (link) {
      await page.goto(link);
      logger.info(`Log: page goes to ${i} th player info page`);

      const playerInfo = await page.evaluate(() => {
        const playerPhotoUrl = document.querySelector(
          "#cphContents_cphContents_cphContents_playerProfile_imgProgile"
        ).src;

        const $infos = document.querySelectorAll(".player_info li");
        const backNumber = Number($infos[1].children[1].textContent);
        const role = $infos[3].children[1].textContent;

        return {
          playerPhotoUrl,
          backNumber,
          role,
        };
      });
      logger.info(`Log: get ${i} th player info`);

      const {
        playerPhotoUrl,
        backNumber,
        role,
      } = playerInfo;

      const kboId = link.replace(/.*playerId=/, "");

      const result = { ...players[i] };
      result.link = link;
      result.kboId = kboId;
      result.playerPhotoUrl = playerPhotoUrl;
      result.backNumber = backNumber;
      result.role = role;

      results.push(result);
    }

    await page.close();
  }

  await browser.close();

  return results;
};

module.exports = fetchPlayersInfo;
