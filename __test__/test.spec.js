const { User, Routine, Action, Character } = require('../models');

fuction allPresetRoutine(( async (req, res) => {
  try {
    const routines = await Routine.findAll({
      where: { preSet:1 },
      include: [
        { model: User },
        { model: Action },
      ],
    }).then(() => {
      console.log('불러진 프리셋 루틴', routines);
      return res.status(200).send({
        result: true,
        routines: routines,
        msg: '목록 불러오기 완료',
      });
    })
    .catch((err) => {
      console.log(er);
      if (err) throw new Error('db 불러오기 실패 에러, 개발팀에 문의해주세요.')
    })
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      result: false,
      msg: err.message,
    });
  }
}
))



test('테스트가 작동하는지 확인하는 테스트', () => {
  expect(1).toBe(1)
});

describe('users와 관련된 라우터를 검증하기 위한 테스트', () => {
  test('이 테스트는 정상작동 하는 것인가?', () => {
    expect(1 === 1).toBeTruthy();
  });
});