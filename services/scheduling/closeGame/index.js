const closeGame = require("./closeGame");

module.exports = async () => {
  try {
    await closeGame();
  } catch (err) {
    console.error(err);
  }
};
