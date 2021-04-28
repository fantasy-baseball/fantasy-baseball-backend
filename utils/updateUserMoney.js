const User = require("../models/User");
const UserBettingData = require("../models/UserBettingData");

module.exports = async (gameDate, session) => {
  try {
    const bettingResult = await UserBettingData
      .find(
        { gameDate },
        "user earnedMoney",
        { session }
      ).lean();

    await Promise.all(
      bettingResult.map((result) => (
        User.findOneAndUpdate(
          { _id: result.user },
          {
            $inc: {
              money: result.earnedMoney,
            },
          },
          { session }
        )
      ))
    );

    await Promise.all(
      bettingResult.map((result) => (
        UserBettingData.findOneAndUpdate(
          { gameDate, user: result.user },
          { isCalculated: true },
          { session }
        )
      ))
    );

    console.log("sumEarnedMoneyWithUserMoney ended");
  } catch (err) {
    console.log(err);
  }
};
