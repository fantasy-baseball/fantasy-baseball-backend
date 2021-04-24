const Statistic = require("../models/Statistic");
const Game = require("../models/Game");

const updateTotalScore = async (gameDate) => {
  const playerScores = await Statistic.find({
    gameDate,
  }, "score").lean();

  const totalScore = playerScores.reduce(
    (acc, curr) => acc + curr.score, 0
  );

  await Game.findOneAndUpdate({ gameDate }, { totalScore });
};

module.exports = updateTotalScore;
