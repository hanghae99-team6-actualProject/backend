const { actionExpGrowth, routineExpGrowth, expLimitPerDay } = require('../constants/characters');
const { User, Routine, Action, Character, ExpDayLog, ActionFin, RoutineFin } = require('../models');
const Sequelize = require('sequelize');
const myError = require('./utils/httpErrors');
const { thisCycle, findLastRoutineFinId, countNullAction } = require('./utils/routineFn');

const Op = Sequelize.Op;

//경험치 제한 작업 영역 - yjh

//upDayTotalExp 함수 내 활용될 변수들
const today = new Date();
const year = today.getFullYear(); // 년도
const month = today.getMonth(); // 월
const date = today.getDate(); // 날짜
const fromToday = new Date(year, month, date, 0, 0, 0);

//루틴완료 경험치 계산 시 활용
let routineExp = 0;

//액션 루틴 완료 시 오늘 날짜 + 계정 기준으로 레코드 생성
const dayLogChk = async (userId, res) => {
  try {
    const dayLogExist = ExpDayLog.findOrCreate({
      where: {
        userId,
        date: {
          [Op.gte]: fromToday,
        },
      },
      defaults: {
        totalExp: 0,
        date: new Date(),
      },
    });
    return dayLogExist;
  } catch (err) {
    console.log(err);
    throw new Error('dayLogChk 함수 실행 에러 발생');
  }
};

//단일 액션 완료 시 당일 한계 경험치 업데이트
const upDayActionExp = async (userId) => {
  await dayLogChk(userId);
  const totalExpChk = await ExpDayLog.findAll({
    where: {
      userId,
      totalExp: {
        [Op.lt]: `${expLimitPerDay}`, //최대값보다 이하인 데이터 탐색
      },
    },
  });

  if ((await totalExpChk.length) == 0) {
    return false;
  } else {
    await ExpDayLog.update(
      {
        totalExp: Sequelize.literal(`totalExp + ${actionExpGrowth}`),
      },
      {
        where: {
          userId,
          date: {
            [Op.gte]: fromToday, //오늘 시작일자보다 이후인 날짜 값에 업데이트
          },
        },
      }
    );
    return true;
  }
};

//액션 + 루틴완료 시 당일 한계 경험치 업데이트
const upDayRoutineExp = async (userId, routineId) => {
  await dayLogChk(userId);
  const totalExpChk = await ExpDayLog.findAll({
    where: {
      userId,
      totalExp: {
        [Op.lt]: `${expLimitPerDay}`,
      },
    },
  });

  try {
    console.log('액션 + 루틴 한계 경험치 진입');
    if ((await totalExpChk.length) == 0) {
      return false;
    } else {
      console.log('액션 + 루틴 엘스로 진입');
      await routineExpCalc(userId, routineId);
      await console.log('루틴exp계산 결과 : ' + routineExp);

      await ExpDayLog.update(
        {
          totalExp: Sequelize.literal(
            `totalExp + ${actionExpGrowth} + ${routineExp}`
          ),
        },
        {
          where: {
            userId,
            date: {
              [Op.gte]: fromToday,
            },
          },
        }
      );
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

//경험치 제한 작업 영역 끝 - yjh

//루틴 경험치 작업 영역 시작 - yjh
const routineExpCalc = async (userId, routineId) => {
  //당일 한계 경험치 체크함수
  await Action.findAndCountAll({
    where: { userId, routineId },
  }).then((result) => {
    routineExp = result.count * `${routineExpGrowth}`;
    console.log('루틴 경험치 계산 진입');
    console.log(routineExp + ' ----- ' + result.count);
    return;
  });
};

//루틴 경험치 작업 영역 끝 - yjh

// 루틴완료 x 액션완료 일때 경험치 획득 + actionExpGrowth
const upExpFinOneAction = async (userId, res) => {
  console.log('핀원액션 들어왔다.');
  //당일 한계 경험치 체크함수
  if (await upDayActionExp(userId)) {
    console.log('캐릭 액션 경험치 함수 진입');
    await Character.update(
      { exp: Sequelize.literal(`exp + ${actionExpGrowth}`) }, // add도 없는 sequelize수준..
      { where: { userId, expMax: 0 } }
    ).catch((err) => {
      console.log(err);
      if (err) throw new Error('upExpFinOneAction 함수 실행 에러 발생');
    });
    return await true;
  } else {
    console.log('캐릭 루틴 경험치 함수 엘스 진입@@@@');
    return await false;
  }
};

// 루틴완료 o 액션완료 일때 경험치 획득 + actionExpGrowth + routineExpGrowth
const upExpAllAction = async (userId, routineId, res) => {
  //당일 한계 경험치 체크함수 - routineId 같이 던지고 해당 함수 내에서 처리
  //
  if (await upDayRoutineExp(userId, routineId)) {
    console.log('캐릭 루틴 경험치 함수 진입');
    await routineExpCalc(userId, routineId);
    await Character.update(
      //아래에서 routine경험치 상수로 박아주는게아니라, 별도로 변수 지정값 리턴 받아서 합산
      { exp: Sequelize.literal(`exp + ${actionExpGrowth} + ${routineExp}`) }, // add도 없는 sequelize수준..
      { where: { userId, expMax: 0 } }
    ).catch((err) => {
      console.log(err);
      if (err) throw new Error('upExpAllAction 함수 실행 에러 발생');
    });
    return await true;
  } else {
    console.log('캐릭 루틴 경험치 함수 엘스 진입@@@@');
    return await false;
  }
};

//액션 완료시 액션에 finDate 업데이트
const setActionFinDate = async (actionId, routineFinId, finDate) => {
  // await Action.update({ finDate }, { where: { id: actionId } })
  await ActionFin.update({ date: finDate }, { where: { actionId, routineFinId } });
  console.log('ActionFin의 date 업데이트 완료');
};

//루틴 완료시 루틴에 finDate 업데이트
const setRoutineFinDate = async (routineId, finDate) => {
  // await Routine.update({ finDate }, { where: { id: routineId } })
  await RoutineFin.update({ date: finDate }, { where: { routineId } });
  console.log('RoutineFin의 date 업데이트 완료');
};


const doneAction = async (req, res, next) => {
  try {
    // 1. 프론트로부터 완료된 액션에 대한 정보 획득, 파라미터로 유저정보 획득
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
    const userId = res.locals.user.id;
    const { actionId, routineId } = req.body;
    const cycle = await thisCycle(routineId);
    const lastRoutineFinId = await findLastRoutineFinId(routineId, cycle);
    const finDate = new Date();
    // 2. 유저정보와 액션이 정말 일치하는 데이터인지 확인
    const thisActionFin = await ActionFin.findOne({
      where: {
        routineFinId: lastRoutineFinId,
        actionId
      }
    })
    //현재 actionFin이 이미 완료되었는지 검증
    if (thisActionFin.date !== null && thisActionFin.date) {
      return next(new Error('이미 완료된 액션인데 왜 들어왔을까요?'));
    }

    //3. 액션에 맞는 ActionFin의 실 데이터 생성
    console.log('setActionFinDate 진입');
    await setActionFinDate(actionId, lastRoutineFinId, finDate)
      .catch((err) => {
        if (err) next(new Error('setActionFinDate db 에러'));
      });

    //4. date가 null인 액션들의 count확인
    const count = await countNullAction(lastRoutineFinId)
      .catch((err) => {
        if (err) next(new Error('date null인 ActionFin count db 에러'));
      });
    // console.log('완료되지 않은 액션의 개수', count);
    // console.log('타겟루틴', target);
    // console.log('타겟루틴속 액션', target[0].Actions);
    // console.log('타겟루틴의 액션 개수', target[0].Actions.length);
    // console.log('타겟루틴의 액션의 액션핀의 데이터값', target[0].Actions[0].ActionFins[0]);
    // console.log('타겟루틴의 액션의 액션핀의 데이터값', target[0].Actions[0].ActionFins[0].date);

    console.log('date: null인 카운트', count);

    //Action들 속 ActionFin의 Date가 null인 것의 개수가 0보다 크다 === 루틴에 완료되지 않은 액션이 있다.
    if (count > 0) {
      console.log('액션만 완료된 경우');

      //5. 액션이 완료되었을때 경험치
      if (await upExpFinOneAction(userId)) {
        console.log('원액션 표시표시');
        return res.status(200).send({
          result: 'true1',
          msg: 'Action 완료 날짜 표시, 경험치 지급 완료',
        });
      } else {
        console.log('원액션 표시표시');
        return res.status(200).send({
          result: 'true3',
          msg: 'Action 완료 날짜 표시, 경험치 지급 불가 ( 사유 : 일일 한계 초과 )',
        });
      }
    } else {
      console.log('액션과 루틴이 함께 완료된 경우');
      //5. 루틴에는 finDate추가
      await setRoutineFinDate(routineId, finDate).catch((err) => {
        if (err) return next(new Error('setRoutineFinDate db 에러'));
      });

      //6. 액션과 루틴이 함께 완료되었을때 경험치
      if (await upExpAllAction(userId, routineId)) {
        return res.status(200).send({
          result: 'true2',
          msg: 'Action과 Routine 완료 날짜 표시, 경험치 지급 완료',
        });
      } else {
        return res.status(201).send({
          result: 'true4',
          msg: 'Action과 Routine 완료 날짜 표시, 경험치 지급 불가 ( 사유 : 일일 한계 초과 )',
        });
      }
    }
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

module.exports = { doneAction };
