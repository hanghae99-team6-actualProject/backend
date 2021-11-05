const presetConst = {
  presetRoutine1: {
    routineName: '움직이기 싫은 오늘, 기본만 하자!',
    isMain: 0,
    preSet: 1,
    actions: [{
      actionName: '앉았다 일어나기',
      actionType: 'stretching',
      actionCnt: 10,
      actionNum: 1,
    },
    {
      actionName: '목 돌리기',
      actionType: 'stretching',
      actionCnt: 10,
      actionNum: 2,
    },
    {
      actionName: '어깨 돌리기',
      actionType: 'stretching',
      actionCnt: 10,
      actionNum: 3,
    },
    {
      actionName: '허리 돌리기',
      actionType: 'stretching',
      actionCnt: 10,
      actionNum: 4,
    },
    {
      actionName: '무릎 돌리기',
      actionType: 'stretching',
      actionCnt: 10,
      actionNum: 5,
    },]
  },
  presetRoutine2:
  {
    routineName: '오늘은 좀 운동이 필요한 날이야!',
    isMain: 0,
    preSet: 1,
    actions: [{
      actionName: '스쿼트',
      actionType: 'body_exercise',
      actionCnt: 10,
      actionNum: 1,
    },
    {
      actionName: '런지',
      actionType: 'body_exercise',
      actionCnt: 10,
      actionNum: 2,
    },
    {
      actionName: '플랭크',
      actionType: 'body_exercise',
      actionCnt: 10,
      actionNum: 3,
    },
    {
      actionName: '푸쉬업',
      actionType: 'body_exercise',
      actionCnt: 10,
      actionNum: 4,
    }]
  },
}

module.exports = presetConst;