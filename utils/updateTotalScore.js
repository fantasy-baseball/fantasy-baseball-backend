const Statistic = require("../models/Statistic");
const Game = require("../models/Game");

const updateTotalScore = async (gameDate) => {
  const playerScores = await Statistic.find({
    gameDate,
  }, "score").lean();

  const playerTotalScore = playerScores.reduce(
    (totalScore, player) => totalScore + player.score, 0
  );

  await Game.findOneAndUpdate(
    { gameDate },
    { totalScore: playerTotalScore }
  );
};

module.exports = updateTotalScore;
