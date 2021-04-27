const crawlStartingLineUpAndSave = require("./crawlStartingLineUpAndSave");
const sendGrouptMail = require("./mail");

module.exports = async () => {
  try {
    await crawlStartingLineUpAndSave();
    await sendGrouptMail();
  } catch (err) {
    console.error(err);
  }
};
