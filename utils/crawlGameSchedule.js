const puppeteer = require("puppeteer");

const crawlGameSchedule = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www.koreabaseball.com/Schedule/GameCenter/Main.aspx#none;");

  const nextGameDate = await page.evaluate(() => (
    document.querySelector(".date-txt").textContent
  ));

  const gameSchedule = await page.evaluate(() => {
    const $gameList = document.querySelectorAll(".game-list > li");

    const result = [];
    for (let i = 0; i < $gameList.length; i += 1) {
      const $game = $gameList[i];
      const time = $game.querySelector(".time").textContent;
      const $homePitcher = $game.querySelector(".home .pitcher");
      const $awayPitcher = $game.querySelector(".away .pitcher");

      const {
        home_nm: { value: home },
        away_nm: { value: away },
        s_nm: { value: stadium },
        g_id: { value: id },
        g_dt: { value: date },
      } = $game.attributes;

      result.push({
        id,
        date,
        time,
        stadium,
        home,
        away,
        homePitcher: $homePitcher ? $homePitcher.textContent.trim() : null,
        awayPitcher: $awayPitcher ? $awayPitcher.textContent.trim() : null,
      });
    }

    return result;
  });

  await browser.close();

  return {
    nextGameDate,
    gameSchedule,
  };
};

module.exports = crawlGameSchedule;
