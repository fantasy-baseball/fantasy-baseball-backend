const puppeteer = require("puppeteer");
const { KBO_PLAYER_SEARCH_URL } = require("../../constants/kboUrl");

const fetchPlayersInfo = async (players) => {
  const result = [];
  for (let i = 0; i < players.length; i += 1) {
    result.push({ ...players[i] });
  }

  const browser = await puppeteer.launch();
  const pages = await Promise.all(
    players.map(() => browser.newPage())
  );

  await Promise.all(
    players.map((player, i) => {
      const page = pages[i];
      return page.goto(KBO_PLAYER_SEARCH_URL + player.name);
    })
  );

  const links = await Promise.all(
    players.map((currentPlayer, i) => {
      const searchCompletePage = pages[i];

      return (
        searchCompletePage.evaluate((toBeMatchedPlayer) => {
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
        }, currentPlayer)
      );
    })
  );

  await Promise.all(
    pages.map((page, i) => (
      page.goto(links[i])
    ))
  );

  const playerInfos = await Promise.all(
    pages.map((page) => (
      page.evaluate(() => {
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
      })
    ))
  );

  for (let i = 0; i < players.length; i += 1) {
    const {
      playerPhotoUrl,
      backNumber,
      role,
    } = playerInfos[i];

    const collectedLink = links[i];
    const kboId = collectedLink.replace(/.*playerId=/, "");

    result[i].link = collectedLink;
    result[i].kboId = kboId;
    result[i].playerPhotoUrl = playerPhotoUrl;
    result[i].backNumber = backNumber;
    result[i].role = role;
  }

  await browser.close();

  return result;
};

module.exports = fetchPlayersInfo;
