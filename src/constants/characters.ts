type CrtConst = {
  preSetList: string[],
  actionExpGrowth: number,
  routineExpGrowth: number,
  expLimitPerDay : number
};

const crtConst: CrtConst = {
  preSetList: ['무지', '라이온', '제이지'], // 캐릭터 풀 같은 고정 상수는 const로 하기 + 다른 파일로 만들어두기 도 좋습니다.
  actionExpGrowth: 100, //임의 값
  routineExpGrowth: 20, //액션 수와 곱해질 값
  expLimitPerDay : 2000 //일일 최대 경험치
}

exports = crtConst;