const { format } = require("date-fns");
const Game = require("../../../models/Game");

module.exports = async () => {
  try {
    const dateString = format(new Date(), "yyyyMMdd");

    await Game.findOneAndUpdate(
      {
        gameDate: dateString,
      },
      {
        isOpened: true,
      }
    );
  } catch (err) {
    console.error(err);
  }
};
