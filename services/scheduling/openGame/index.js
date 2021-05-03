const { format } = require("date-fns");
const fetchStartingLineUpAndSave = require("./fetchStartingLineUpAndSave");
const sendGrouptMail = require("./sendGroupMail");
const logger = require("../../../config/winston");

module.exports = async () => {
  try {
    logger.info("Start: open game");

    const dateString = format(new Date(), "yyyyMMdd");

    await fetchStartingLineUpAndSave(dateString);
    // await sendGrouptMail("openEmail");

    logger.info("End: open game");
  } catch (err) {
    logger.error(err);
  }
};
