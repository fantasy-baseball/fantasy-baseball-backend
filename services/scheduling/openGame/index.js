const getStartingLineUpAndSave = require("./fetchStartingLineUpAndSave");
const sendGrouptMail = require("./sendGroupMail");

module.exports = async () => {
  try {
    await getStartingLineUpAndSave();
    await sendGrouptMail();
  } catch (err) {
    console.error(err);
  }
};
