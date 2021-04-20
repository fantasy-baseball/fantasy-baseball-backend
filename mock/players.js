const players = [
  {
    team: "SSG", name: "오태곤", position: "좌익수", playerType: "hitter"
  },
  {
    team: "SSG", name: "추신수", position: "지명타자", playerType: "hitter"
  },
  {
    team: "SSG", name: "최정", position: "3루수", playerType: "hitter"
  },
  {
    team: "SSG", name: "로맥", position: "1루수", playerType: "hitter"
  },
  {
    team: "SSG", name: "최주환", position: "2루수", playerType: "hitter"
  },
  {
    team: "SSG", name: "한유섬", position: "우익수", playerType: "hitter"
  },
  {
    team: "SSG", name: "김강민", position: "중견수", playerType: "hitter"
  },
  {
    team: "SSG", name: "이재원", position: "포수", playerType: "hitter"
  },
  {
    team: "SSG", name: "박성한", position: "유격수", playerType: "hitter"
  },
  {
    team: "SSG", name: "박종훈", position: "투수", playerType: "pitcher"
  },
  {
    team: "KIA", name: "최원준", position: "우익수", playerType: "hitter"
  },
  {
    team: "KIA", name: "김선빈", position: "2루수", playerType: "hitter"
  },
  {
    team: "KIA", name: "터커", position: "1루수", playerType: "hitter"
  },
  {
    team: "KIA", name: "최형우", position: "지명타자", playerType: "hitter"
  },
  {
    team: "KIA", name: "이창진", position: "중견수", playerType: "hitter"
  },
  {
    team: "KIA", name: "류지혁", position: "3루수", playerType: "hitter"
  },
  {
    team: "KIA", name: "이우성", position: "좌익수", playerType: "hitter"
  },
  {
    team: "KIA", name: "한승택", position: "포수", playerType: "hitter"
  },
  {
    team: "KIA", name: "박찬호", position: "유격수", playerType: "hitter"
  },
  {
    team: "KIA", name: "멩덴", position: "투수", playerType: "pitcher"
  },
  {
    team: "LG", name: "홍창기", position: "우익수", playerType: "hitter"
  },
  {
    team: "LG", name: "이천웅", position: "중견수", playerType: "hitter"
  },
  {
    team: "LG", name: "김현수", position: "좌익수", playerType: "hitter"
  },
  {
    team: "LG", name: "라모스", position: "1루수", playerType: "hitter"
  },
  {
    team: "LG", name: "채은성", position: "지명타자", playerType: "hitter"
  },
  {
    team: "LG", name: "오지환", position: "유격수", playerType: "hitter"
  },
  {
    team: "LG", name: "김민성", position: "3루수", playerType: "hitter"
  },
  {
    team: "LG", name: "유강남", position: "포수", playerType: "hitter"
  },
  {
    team: "LG", name: "신민재", position: "2루수", playerType: "hitter"
  },
  {
    team: "LG", name: "수아레즈", position: "투수", playerType: "pitcher"
  },
  {
    team: "두산", name: "허경민", position: "3루수", playerType: "hitter"
  },
  {
    team: "두산", name: "조수행", position: "중견수", playerType: "hitter"
  },
  {
    team: "두산", name: "박건우", position: "지명타자", playerType: "hitter"
  },
  {
    team: "두산", name: "김재환", position: "좌익수", playerType: "hitter"
  },
  {
    team: "두산", name: "양석환", position: "1루수", playerType: "hitter"
  },
  {
    team: "두산", name: "국해성", position: "우익수", playerType: "hitter"
  },
  {
    team: "두산", name: "장승현", position: "포수", playerType: "hitter"
  },
  {
    team: "두산", name: "박계범", position: "2루수", playerType: "hitter"
  },
  {
    team: "두산", name: "안재석", position: "유격수", playerType: "hitter"
  },
  {
    team: "두산", name: "최원준", position: "투수", playerType: "pitcher"
  },
  {
    team: "롯데", name: "안치홍", position: "2루수", playerType: "hitter"
  },
  {
    team: "롯데", name: "손아섭", position: "우익수", playerType: "hitter"
  },
  {
    team: "롯데", name: "전준우", position: "좌익수", playerType: "hitter"
  },
  {
    team: "롯데", name: "이대호", position: "지명타자", playerType: "hitter"
  },
  {
    team: "롯데", name: "마차도", position: "유격수", playerType: "hitter"
  },
  {
    team: "롯데", name: "오윤석", position: "1루수", playerType: "hitter"
  },
  {
    team: "롯데", name: "한동희", position: "3루수", playerType: "hitter"
  },
  {
    team: "롯데", name: "김준태", position: "포수", playerType: "hitter"
  },
  {
    team: "롯데", name: "신용수", position: "중견수", playerType: "hitter"
  },
  {
    team: "롯데", name: "프랑코", position: "투수", playerType: "pitcher"
  },
  {
    team: "삼성", name: "김지찬", position: "2루수", playerType: "hitter"
  },
  {
    team: "삼성", name: "구자욱", position: "지명타자", playerType: "hitter"
  },
  {
    team: "삼성", name: "박해민", position: "중견수", playerType: "hitter"
  },
  {
    team: "삼성", name: "피렐라", position: "좌익수", playerType: "hitter"
  },
  {
    team: "삼성", name: "강민호", position: "포수", playerType: "hitter"
  },
  {
    team: "삼성", name: "강한울", position: "3루수", playerType: "hitter"
  },
  {
    team: "삼성", name: "이원석", position: "1루수", playerType: "hitter"
  },
  {
    team: "삼성", name: "김헌곤", position: "우익수", playerType: "hitter"
  },
  {
    team: "삼성", name: "이학주", position: "유격수", playerType: "hitter"
  },
  {
    team: "삼성", name: "백정현", position: "투수", playerType: "pitcher"
  },
  {
    team: "NC", name: "박민우", position: "2루수", playerType: "hitter"
  },
  {
    team: "NC", name: "이명기", position: "좌익수", playerType: "hitter"
  },
  {
    team: "NC", name: "나성범", position: "지명타자", playerType: "hitter"
  },
  {
    team: "NC", name: "양의지", position: "포수", playerType: "hitter"
  },
  {
    team: "NC", name: "알테어", position: "중견수", playerType: "hitter"
  },
  {
    team: "NC", name: "강진성", position: "1루수", playerType: "hitter"
  },
  {
    team: "NC", name: "권희동", position: "우익수", playerType: "hitter"
  },
  {
    team: "NC", name: "노진혁", position: "유격수", playerType: "hitter"
  },
  {
    team: "NC", name: "박준영", position: "3루수", playerType: "hitter"
  },
  {
    team: "NC", name: "송명기", position: "투수", playerType: "pitcher"
  },
  {
    team: "한화", name: "정은원", position: "2루수", playerType: "hitter"
  },
  {
    team: "한화", name: "강경학", position: "3루수", playerType: "hitter"
  },
  {
    team: "한화", name: "하주석", position: "유격수", playerType: "hitter"
  },
  {
    team: "한화", name: "힐리", position: "1루수", playerType: "hitter"
  },
  {
    team: "한화", name: "이성열", position: "지명타자", playerType: "hitter"
  },
  {
    team: "한화", name: "임종찬", position: "우익수", playerType: "hitter"
  },
  {
    team: "한화", name: "정진호", position: "좌익수", playerType: "hitter"
  },
  {
    team: "한화", name: "이해창", position: "포수", playerType: "hitter"
  },
  {
    team: "한화", name: "유장혁", position: "중견수", playerType: "hitter"
  },
  {
    team: "한화", name: "김범수", position: "투수", playerType: "pitcher"
  },
  {
    team: "KT", name: "조용호", position: "우익수", playerType: "hitter"
  },
  {
    team: "KT", name: "배정대", position: "중견수", playerType: "hitter"
  },
  {
    team: "KT", name: "강백호", position: "1루수", playerType: "hitter"
  },
  {
    team: "KT", name: "알몬테", position: "좌익수", playerType: "hitter"
  },
  {
    team: "KT", name: "문상철", position: "지명타자", playerType: "hitter"
  },
  {
    team: "KT", name: "황재균", position: "3루수", playerType: "hitter"
  },
  {
    team: "KT", name: "박경수", position: "2루수", playerType: "hitter"
  },
  {
    team: "KT", name: "이홍구", position: "포수", playerType: "hitter"
  },
  {
    team: "KT", name: "심우준", position: "유격수", playerType: "hitter"
  },
  {
    team: "KT", name: "데스파이네", position: "투수", playerType: "pitcher"
  },
  {
    team: "키움", name: "서건창", position: "2루수", playerType: "hitter"
  },
  {
    team: "키움", name: "김혜성", position: "유격수", playerType: "hitter"
  },
  {
    team: "키움", name: "이정후", position: "중견수", playerType: "hitter"
  },
  {
    team: "키움", name: "박병호", position: "1루수", playerType: "hitter"
  },
  {
    team: "키움", name: "프레이타스", position: "지명타자", playerType: "hitter"
  },
  {
    team: "키움", name: "김웅빈", position: "3루수", playerType: "hitter"
  },
  {
    team: "키움", name: "박동원", position: "포수", playerType: "hitter"
  },
  {
    team: "키움", name: "김은성", position: "좌익수", playerType: "hitter"
  },
  {
    team: "키움", name: "이용규", position: "우익수", playerType: "hitter"
  },
  {
    team: "키움", name: "안우진", position: "투수", playerType: "pitcher"
  }
];

module.exports = players;
