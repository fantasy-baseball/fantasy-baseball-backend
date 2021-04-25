const Game = require("../models/Game");
const User = require("../models/User");
const Statistic = require("../models/Statistic");
const UserBettingData = require("../models/UserBettingData");

const calculateLosingMoneyForWinner = async (winners, gameDate, ratio) => {
  const gameData = await Game.findOne({ gameDate });
  const totalBettingMoney = gameData.totalMoney / 10;
  const winnerList = [];

  winners.forEach((position) => {
    const totalWinnerMoney = position.users
      .flat()
      .reduce((acc, winner) => acc + winner.bettingMoney, 0);
    let losingMoney = (totalBettingMoney - totalWinnerMoney) * ratio;

    position.users.forEach((group) => {
      if (position.users.length > 1) {
        losingMoney = Math.round(losingMoney / position.users.length);
      }

      group.forEach((user) => {
        const totalWinnerMoneyPerGroup = group.reduce((acc, winner) => (
          acc + winner.bettingMoney),
        0);
        const percentage = Number((user.bettingMoney / totalWinnerMoneyPerGroup).toFixed(2));
        winnerList.push({
          id: user.id,
          earnedMoney: Math.round(totalWinnerMoney * percentage),
        });
      });
    });
  });

  await Promise.all(
    winnerList.map((user) => (
      UserBettingData.findOneAndUpdate(
        { gameDate, user: user.id },
        {
          $inc: {
            earnedMoney: user.earnedMoney,
          },
        }
      )
    ))
  );
};

const calculateBettingMoney = async (gameDate) => {
  // 1. gameDate와 일치하는 Statistic을 찾음 : $match
  // 2. score 점수로 오름차순 sorting : $sort
  // 3. position 별로 그루핑 : $group
  //    - "totalBettingMoney"의 값이 0 이상인 선수들만 $push
  const statisticsPerPosition = await Statistic.aggregate([
    {
      $match: {
        gameDate,
      },
    },
    {
      $sort: {
        score: -1,
      },
    },
    {
      $group: {
        _id: "$position",
        players: {
          $push: {
            $cond: {
              if: {
                $gt: ["$totalBettingMoney", 0],
              },
              then: {
                player: "$playerId",
                score: "$score",
                totalBettingMoney: "$totalBettingMoney",
                users: "$users",
              },
              else: "$noval",
            },
          },
        },
      },
    },
  ]);

  const selectedFirstPlayerUsers = [];
  const selectedSecondPlayerUsers = [];
  let awardedUsers = [];

  statisticsPerPosition.forEach((position, posIndex) => {
    const bestScore = position.players[0].score;
    let secondScore;

    position.players.forEach((player) => {
      if (bestScore === player.score) {
        if (selectedFirstPlayerUsers[posIndex]) {
          selectedFirstPlayerUsers[posIndex].users.push(
            player.users
          );
          awardedUsers.push(player.users);
          return;
        }

        selectedFirstPlayerUsers.push({
          position: position._id,
          users: [player.users],
        });
        awardedUsers.push(player.users);
        return;
      }

      // 1등 동점자가 존재하는 경우 2등은 계산하지 않음
      if (selectedFirstPlayerUsers[posIndex].users.length > 1) return;

      // 2등 스코어 최초 등장
      if (bestScore > player.score) {
        // 2등 스코어가 이미 존재하는 경우 return
        if (secondScore !== undefined && secondScore > player.score) return;

        secondScore = player.score;
        selectedSecondPlayerUsers.push({
          position: position._id,
          users: [player.users],
        });
        awardedUsers.push(player.users);
        return;
      }

      if (secondScore === player.score) {
        if (selectedSecondPlayerUsers[posIndex]) {
          selectedSecondPlayerUsers[posIndex].users.push(
            player.users
          );
          awardedUsers.push(player.users);
        }
      }
    });
  });

  awardedUsers = awardedUsers.flat();

  // 포지션별 1등, 2등을 선택한 유저에게만 우선 돈을 돌려줌
  await Promise.all(
    awardedUsers.map((user) => (
      UserBettingData.findOneAndUpdate(
        {
          gameDate,
          user: user.id,
        },
        {
          $inc: {
            earnedMoney: user.bettingMoney,
          },
        }
      )
    ))
  );

  // 1등에게 0.7% 지분 분배
  await calculateLosingMoneyForWinner(selectedFirstPlayerUsers, gameDate, 0.7);
  // 2등에게 0.3% 지분 분배
  await calculateLosingMoneyForWinner(selectedSecondPlayerUsers, gameDate, 0.3);

  console.log("Calculate earned money for betting");
};

const sumEarnedMoneyWithUserMoney = async (gameDate) => {
  const bettingResult = await UserBettingData.find({ gameDate }, "user earnedMoney").lean();

  await Promise.all(
    bettingResult.map((result) => (
      User.findOneAndUpdate(
        { _id: result.user },
        {
          $inc: {
            money: result.earnedMoney,
          },
        }
      )
    ))
  );

  await Promise.all(
    bettingResult.map((result) => (
      UserBettingData.findOneAndUpdate(
        { gameDate, user: result.user },
        { isCalculated: true }
      )
    ))
  );

  console.log("Add earned money to user money");
};

// TODO : 스케쥴링에 함수 추가
// (async () => {
//   await calculateBettingMoney("20210420");
//   await sumEarnedMoneyWithUserMoney("20210420");
// })();
