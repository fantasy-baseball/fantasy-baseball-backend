const PITCHER_RECORD_CATEGORY = {
  WP: -5,
  BK: -5,
  PK: 10,
  Wgs: 125,
  L: -25,
  IP: 12,
  H: -7,
  HR: -10,
  BB: -5,
  SO: 10,
  R: -5,
  ER: -10,
};

const HITTER_RECORD_COTEGORY = {
  WH: 20,
  RO: -5,
  DP: -10,
  CS: -5,
  Err: -10,
  PA: 1,
  RBI: 10,
  R: 5,
  "1B": 10,
  "2B": 20,
  "3B": 30,
  HR: 50,
  SH: 5,
  BB: 5,
  IBB: 10,
  Out: -5,
  SO: -10,
  CH: 100,
};

const calculatePitcherScore = () => {

};

const calculateHitterScore = () => {

};

const calculateHitForTheCycle = (record) => {
  const copiedRecord = record.slice();
  let count = 0;

  for (let i = 0; i < copiedRecord.length; i += 1) {
    if (copiedRecord[i].includes("안") || copiedRecord[i].includes("2") || copiedRecord[i].includes("3")) {
      count += 1;
    }
  }
};

const calculatePlayerScore = (player) => {
  const { record } = player;
  let totalScore = 0;

  for (let i = 0; i < record.length; i += 1) {
    if (!record[i]) {
      continue;
    }

    totalScore += HITTER_RECORD_COTEGORY.PA;

    if (record[i].includes("실") || record[i].includes("병")) {
      continue;
    }

    if (record[i].includes("땅") || record[i].includes("비") || record[i].includes("직") || record[i].includes("파")) {
      totalScore += HITTER_RECORD_COTEGORY.Out;
      continue;
    }

    if (record[i].includes("안")) {
      totalScore += HITTER_RECORD_COTEGORY["1B"];
    }

    if (record[i].includes("2")) {
      totalScore += HITTER_RECORD_COTEGORY["2B"];
    }

    if (record[i].includes("3")) {
      totalScore += HITTER_RECORD_COTEGORY["3B"];
    }

    if (record[i].includes("홈")) {
      totalScore += HITTER_RECORD_COTEGORY.HR;
    }

    if (record[i].includes("삼진")) {
      totalScore += HITTER_RECORD_COTEGORY.SO;
    }

    if (record[i].includes("4구")) {
      totalScore += HITTER_RECORD_COTEGORY.BB;
    }

    if (record[i].includes("고4")) {
      totalScore += HITTER_RECORD_COTEGORY.IBB;
    }

    if (record[i].includes("희")) {
      totalScore += HITTER_RECORD_COTEGORY.SH;
    }

    if (record[i].includes("/")) {
      totalScore += record[i].split("/").length - 1;
    }
  }

  return totalScore;
};

module.exports = calculatePlayerScore;
