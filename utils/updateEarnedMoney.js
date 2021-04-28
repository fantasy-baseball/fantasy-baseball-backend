const Game = require("../models/Game");
const Statistic = require("../models/Statistic");
const UserBettingData = require("../models/UserBettingData");

const updateMoneyForUser = async (users, gameDate, moneyType, session) => {
  await Promise.all(
    users.map((user) => (
      UserBettingData.findOneAndUpdate(
        { gameDate, user: user.id },
        {
          $inc: {
            earnedMoney: user[moneyType],
          },
        },
        { session }
      )
    ))
  );
};

const calculateLosingMoneyForWinner = async (
  winners,
  gameDate,
  winnerMoneyList,
  ratio
) => {
  try {
    const gameData = await Game.findOne({ gameDate });
    const totalBettingMoneyPerPosition = gameData.totalMoney / 10;
    const winnerList = [];

    winners.forEach((position, positionIndex) => {
      // 포지션별 나머지 돈 합계
      let losingMoney = (
        totalBettingMoneyPerPosition - winnerMoneyList[positionIndex].totalMoney
      ) * ratio;

      position.users.forEach((group) => {
        // 동점자가 있는 경우 그룹 별로 1/n로 나누어가짐
        losingMoney = Math.round(losingMoney / position.users.length);

        group.forEach((user) => {
          const totalWinnerMoneyPerGroup = group.reduce(
            (acc, winner) => (
              acc + winner.bettingMoney
            ), 0
          );
          const percentage = Number(
            (user.bettingMoney / totalWinnerMoneyPerGroup).toFixed(2)
          );
          winnerList.push({
            id: user.id,
            earnedMoney: Math.round(losingMoney * percentage),
          });
        });
      });
    });

    return winnerList;
  } catch (err) {
    console.log(err);
  }
};

module.exports = async (gameDate, session) => {
  // 1. gameDate와 일치하는 Statistic을 찾음 : $match
  // 2. score 점수로 오름차순 sorting : $sort
  // 3. position 별로 그루핑 : $group
  //    - "totalBettingMoney"의 값이 0 이상인 선수들만 $push
  try {
    const statisticsPerPosition = await Statistic
      .aggregate([
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
      ])
      .session(session);

    const usersSelectingFirstPlayer = [];
    const usersSelectingSecondPlayer = [];
    const winnersMoneyList = [];
    let awardedUsers = [];

    statisticsPerPosition.forEach((position, positionIndex) => {
      const bestScore = position.players[0].score;
      let secondScore = null;

      winnersMoneyList.push({
        position: position._id,
        totalMoney: 0,
      });

      position.players.forEach((player, playerIndex) => {
        if (bestScore === player.score) {
          if (usersSelectingFirstPlayer[positionIndex]) {
            usersSelectingFirstPlayer[positionIndex].users.push(
              player.users
            );
            winnersMoneyList[positionIndex].totalMoney += player.totalBettingMoney;
            awardedUsers.push(player.users);
            return;
          }

          usersSelectingFirstPlayer.push({
            position: position._id,
            users: [player.users],
          });
          winnersMoneyList[positionIndex].totalMoney += player.totalBettingMoney;
          awardedUsers.push(player.users);
          return;
        }

        // 1등 동점자가 존재하는 경우 2등은 계산하지 않음
        if (usersSelectingFirstPlayer[positionIndex].users.length > 1) return;

        if (secondScore === player.score) {
          if (usersSelectingSecondPlayer[positionIndex]) {
            usersSelectingSecondPlayer[positionIndex].users.push(
              player.users
            );
            winnersMoneyList[positionIndex].totalMoney += player.totalBettingMoney;
            awardedUsers.push(player.users);
          }
          return;
        }

        // 2등 스코어 최초 등장
        if (bestScore > player.score) {
          // 2등 스코어가 이미 존재하는 경우 return
          if (secondScore !== null || secondScore > player.score) return;

          secondScore = player.score;
          usersSelectingSecondPlayer.push({
            position: position._id,
            users: [player.users],
          });
          winnersMoneyList[positionIndex].totalMoney += player.totalBettingMoney;
          awardedUsers.push(player.users);
          return;
        }

        if (playerIndex === position.players.length - 1) {
          secondScore = null;
        }
      });
    });

    awardedUsers = awardedUsers.flat();

    // 우승한 유저들에게 본인이 건 돈 돌려주기
    await updateMoneyForUser(awardedUsers, gameDate, "bettingMoney", session);

    // 각 유저별 earnedMoney 계산 후 유저가 담긴 list 반환
    const firstWinnerList = await calculateLosingMoneyForWinner(
      usersSelectingFirstPlayer,
      gameDate,
      winnersMoneyList,
      0.7
    );
    const secondWinnerList = await calculateLosingMoneyForWinner(
      usersSelectingSecondPlayer,
      gameDate,
      winnersMoneyList,
      0.3
    );

    // 유저별 획득한 돈 업데이트
    await updateMoneyForUser(firstWinnerList, gameDate, "earnedMoney", session);
    await updateMoneyForUser(secondWinnerList, gameDate, "earnedMoney", session);

    console.log("updateEarnedMoney ended");
  } catch (err) {
    console.error(err);
  }
};
