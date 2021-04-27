const getStartingLineUpAndSave = require("./getStartingLineUpAndSave");
const sendGrouptMail = require("./mail");

module.exports = async () => {
  try {
    await getStartingLineUpAndSave();
    await sendGrouptMail();
  } catch (err) {
    console.error(err);
  }
};
