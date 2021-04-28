const Statistic = require("../../../models/Statistic");

const updateScorePercentage = async (position, gameDate) => {
  const statistics = [];
  let players = await Statistic.find({
    gameDate,
    position,
  }, "score").lean();

  const scores = players.map(
    (player) => player.score
  );
  const minScore = Math.min(...scores);

  if (minScore < 0) {
    const positiveNum = -1 * minScore;

    players = players.map(
      (player) => ({
        ...player,
        score: player.score + positiveNum,
      })
    );
  }

  const positionTotalScore = players.reduce(
    (totalScore, player) => totalScore + player.score, 0
  );

  for (let i = 0; i < players.length; i += 1) {
    const { _id } = players[i];
    const scorePercentage = Math.round(
      (players[i].score / positionTotalScore) * 100
    ) * 0.01;

    statistics.push(
      Statistic.findOneAndUpdate({ _id }, { scorePercentage })
    );
  }

  await Promise.all(statistics);
};

module.exports = updateScorePercentage;
