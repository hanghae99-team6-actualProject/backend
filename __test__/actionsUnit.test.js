const {
  expLimitPerDay
} = require('../constants/characters');
const {
  upDayActionExp,
  upDayRoutineExp,
  chkDayLog,
  doneAction,
  calcRoutineExp,
} = require('../controllers/actions');

//a 값을 넣었을 때 b값이 출력되는지, 함수 동작의도에 맞게 동작하는지 체크하는 것을 기준으로 작업해야한다.

//테스트코드 취소(보류)
// => 프로젝트 성격 상 기획변경이 잦고 기획, 디자인 프론트 백이 동시에 일정시작함.. 따라서 빠른 처리가 필요해서 기능 구현 먼저함
// 추가로 기획변경도 빈번함
// API 확정 후 통합테스트까지만 구현해서 테스팅하고 단위테스트는 생략.

//문제..
//한계 겅험치와 비교해서 true, false 나눠야하는데, 흠... 직접 지정해서 가보자.
//위의 경우엔 실제 함수를 호출하므로 더미데이터를 활용해 케이스 검증이 보다 확실함
//아래는 테스트코드가 로직을 좀 더 구체화해서 기대되는 값을 표현하지만, 다소 당연하게 느껴지는 부분
//아래도 충분히 의미가 있다고 볼 수 있는가? => TDD의 경우 특히 실제 기능 구현 전에 작성하는데.. 흠
// => 실제 코드를 안만들고 구조를 잡아보려하거나 하는 경우라면 mock함수로.. 그게 아니라면 실제코드를 대상으로하는게 맞다.
// => 코드 수정 및 추가됐을 때 기존테스트에 영향 미치는지를 체크해야하는데, 전부 mock함수라면 체크가 불가하다.

describe('한계 경험치 관련 테스트', () => {
  test('chkDayLog 함수 호출 시 유저의 한계 경험치 데이터를 리턴한다.', async () => {
    let totalExp1 = 0;
    let totalExp2 = 0;

    //체크로그 호출하고나서 받아온 값에 대해서 배열, 객체 접근해야 가져옴
    //chkDayLog(1)[0] 와 같이 적용하면 undefined
    await chkDayLog(1).then((value) => {
      totalExp1 = value[0].dataValues.totalExp;
    });
    await chkDayLog(2).then((value) => {
      totalExp2 = value[0].dataValues.totalExp;
    });

    //seed 데이터 기준 1,2 분리하여 테스트
    expect(totalExp1).toBeLessThanOrEqual(expLimitPerDay);
    expect(totalExp2).toBeGreaterThan(expLimitPerDay);
  });

  test('단일 액션 완료 시 당일 한계 경험치가 최대값보다 낮다면 업데이트하고 true를 리턴한다.', async () => {
    expect(await upDayActionExp(1)).toBe(true);
  });

  test('마지막 액션 완료 시 루틴이 함께  당일 한계 경험치가 최대값보다 낮다면 업데이트하고 true를 리턴한다.', async () => {
    expect(await upDayRoutineExp(2, 12)).toBe(true);
  });


  //함수를 테스트하고자 하는 상황. req,res,next를 인자로 받으므로 테스트 상에서 필요한 값을 할당해야함
  //req는 테스트 대상 데이터가 들어가면 되고, next는 실제 데이터를 넘겨줄 필요 없으므로 mock로 생성
  //그런데, res는 res.locals.user.id 데이터 보내고 status 값 지정도해야하는 것 아닌지.. 받아야하는데..
  test.only('doneAction 호출 시  ', async () => {
    const req = {
      actionId: 13,
      routineId: 5
    };
    const res = {
      status: jest.fn(() => res),
    };
    const next = jest.fn();

    doneAction(req, res, next);
    expect(res.status).toBe(200);
  });
});
