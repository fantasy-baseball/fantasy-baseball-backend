const puppeteer = require("puppeteer");
const { KBO_PLAYER_SEARCH_URL } = require("../constants/crawling");

const crawlPlayersInfo = async (players) => {
  const result = [];
  for (let i = 0; i < players.length; i += 1) {
    result.push({ ...players[i] });
  }

  const browser = await puppeteer.launch();

  let pages = [];
  for (let i = 0; i < players.length; i += 1) {
    pages.push(browser.newPage());
  }

  pages = await Promise.all(pages);

  const searchPages = [];
  for (let i = 0; i < players.length; i += 1) {
    const page = pages[i];
    searchPages.push(page.goto(KBO_PLAYER_SEARCH_URL + players[i].name));
  }

  await Promise.all(searchPages);

  let links = [];
  for (let i = 0; i < players.length; i += 1) {
    const searchCompletePage = pages[i];
    const currentPlayer = players[i];

    links.push(searchCompletePage.evaluate((toBeMatchedPlayer) => {
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
    }, currentPlayer));
  }

  links = await Promise.all(links);

  const playerInfoPage = [];
  for (let i = 0; i < players.length; i += 1) {
    const page = pages[i];
    const collectedLink = links[i];
    const kboId = collectedLink.replace(/.*playerId=/, "");

    result[i].link = collectedLink;
    result[i].kboId = kboId;

    playerInfoPage.push(page.goto(collectedLink));
  }

  await Promise.all(playerInfoPage);

  let playerInfos = [];
  for (let i = 0; i < players.length; i += 1) {
    const page = pages[i];

    playerInfos.push(page.evaluate(() => {
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
    }));
  }

  playerInfos = await Promise.all(playerInfos);

  for (let i = 0; i < players.length; i += 1) {
    const {
      playerPhotoUrl,
      backNumber,
      role,
    } = playerInfos[i];

    result[i].playerPhotoUrl = playerPhotoUrl;
    result[i].backNumber = backNumber;
    result[i].role = role;
  }

  await browser.close();

  return result;
};

module.exports = crawlPlayersInfo;
