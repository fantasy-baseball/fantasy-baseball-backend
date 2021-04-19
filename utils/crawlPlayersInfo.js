const puppeteer = require("puppeteer");
const { KBO_PLAYER_SEARCH_URL } = require("../constants/crawling");

const crawlPlayersInfo = async (players) => {
  const newPlayers = [];
  for (let i = 0; i < players.length; i += 1) {
    newPlayers.push({ ...players[i] });
  }

  const browser = await puppeteer.launch();

  const pages = [];
  for (let i = 0; i < players.length; i += 1) {
    pages.push(browser.newPage());
  }

  const createdPages = await Promise.all(pages);

  const searchPages = [];
  for (let i = 0; i < players.length; i += 1) {
    const page = createdPages[i];
    searchPages.push(page.goto(KBO_PLAYER_SEARCH_URL + players[i].name));
  }

  await Promise.all(searchPages);

  const links = [];
  for (let i = 0; i < players.length; i += 1) {
    const searchCompletePage = createdPages[i];
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

  const collectedLinks = await Promise.all(links);

  const playerInfoPage = [];
  for (let i = 0; i < players.length; i += 1) {
    const page = createdPages[i];
    const collectedLink = collectedLinks[i];
    const kboId = collectedLink.replace(/.*playerId=/, "");

    newPlayers[i].link = collectedLink;
    newPlayers[i].kboId = kboId;

    playerInfoPage.push(page.goto(collectedLink));
  }

  await Promise.all(playerInfoPage);

  const playerInfos = [];
  for (let i = 0; i < players.length; i += 1) {
    const page = createdPages[i];

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

  const collectedPlayerInfos = await Promise.all(playerInfos);

  for (let i = 0; i < players.length; i += 1) {
    const {
      playerPhotoUrl,
      backNumber,
      role,
    } = collectedPlayerInfos[i];

    newPlayers[i].playerPhotoUrl = playerPhotoUrl;
    newPlayers[i].backNumber = backNumber;
    newPlayers[i].role = role;
  }

  await browser.close();

  return newPlayers;
};

module.exports = crawlPlayersInfo;
