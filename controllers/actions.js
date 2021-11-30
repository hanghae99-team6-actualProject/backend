const { actionExpGrowth, routineExpGrowth, expLimitPerDay } = require('../constants/characters');
const { Action, Character, ExpDayLog, ActionFin, RoutineFin } = require('../models');
const Sequelize = require('sequelize');
const myError = require('./utils/httpErrors');
const { thisCycle, findLastRoutineFinId, countNullAction } = require('./utils/routineFn');
const logger = require('../logger');
const Op = Sequelize.Op;

//upDayTotalExp 함수 내 활용될 변수들
function timeSet() {
  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = today.getMonth(); // 월
  const date = today.getDate(); // 날짜
  const fromToday = new Date(year, month, date, 0, 0, 0);

  return { fromToday };
}

//루틴완료 경험치 계산 시 활용
let routineExp = 0;

//액션 루틴 완료 시 오늘 날짜 + 계정 기준으로 레코드 생성
const chkDayLog = async (userId) => {
  try {
    const { fromToday } = timeSet();

    const dayLogExist = await ExpDayLog.findOrCreate({
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
    logger.error(err);
    throw new Error('chkDayLog 함수 실행 에러 발생');
  }
};

//단일 액션 완료 시 당일 한계 경험치 업데이트
const upDayActionExp = async (userId) => {
  const { fromToday } = timeSet();

  await chkDayLog(userId);
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
  const { fromToday } = timeSet();

  await chkDayLog(userId);
  const totalExpChk = await ExpDayLog.findAll({
    where: {
      userId,
      totalExp: {
        [Op.lt]: `${expLimitPerDay}`,
      },
    },
  });

  try {
    logger.info('액션 + 루틴 한계 경험치 진입');
    if ((await totalExpChk.length) == 0) {
      logger.info('액션 + 루틴 IF문 진입');
      logger.info(totalExpChk.length);
      return false;
    } else {
      logger.info('액션 + 루틴 엘스로 진입');
      await calcRoutineExp(userId, routineId);
      logger.info('루틴exp계산 결과 : ' + routineExp);

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
    logger.error(err);
    return false;
  }
};

//당일 한계 경험치 체크
const calcRoutineExp = async (userId, routineId) => {
  await Action.findAndCountAll({
    where: { userId, routineId, isDel: 0 },
  }).then((result) => {
    routineExp = result.count * `${routineExpGrowth}`;
    logger.info('루틴 경험치 계산 진입');
    logger.info(routineExp + ' ----- ' + result.count);
    return;
  });
};

// 루틴완료 x 액션완료 일때 경험치 획득 + actionExpGrowth
const upExpFinOneAction = async (userId) => {
  //당일 한계 경험치 체크함수
  if (await upDayActionExp(userId)) {
    logger.info('캐릭 액션 경험치 함수 진입');
    await Character.update(
      { exp: Sequelize.literal(`exp + ${actionExpGrowth}`) },
      { where: { userId, expMax: 0 } }
    )
    return true;
  } else {
    logger.info('캐릭 루틴 경험치 함수 엘스 진입');
    return false;
  }
};

// 루틴완료 o 액션완료 일때 경험치 획득 + actionExpGrowth + routineExpGrowth
const upExpAllAction = async (userId, routineId) => {
  //당일 한계 경험치 체크함수 - routineId 같이 던지고 해당 함수 내에서 처리
  if (await upDayRoutineExp(userId, routineId)) {
    logger.info('캐릭 루틴 경험치 함수 진입');
    await calcRoutineExp(userId, routineId);
    await Character.update(
      //아래에서 routine경험치 상수로 박아주는게아니라, 별도로 변수 지정값 리턴 받아서 합산
      { exp: Sequelize.literal(`exp + ${actionExpGrowth} + ${routineExp}`) },
      { where: { userId, expMax: 0 } }
    )
    return true;
  } else {
    logger.info('캐릭 루틴 경험치 함수 엘스 진입');
    return false;
  }
};

//액션 완료시 액션에 finDate 업데이트
const setActionFinDate = async (actionId, routineFinId, finDate) => {
  await ActionFin.update({ date: finDate }, { where: { actionId, routineFinId } });
  logger.info('ActionFin의 date 업데이트 완료');
};

//루틴 완료시 루틴에 finDate 업데이트
const setRoutineFinDate = async (routineId, finDate) => {
  await RoutineFin.update({ date: finDate }, { where: { routineId } });
  logger.info('RoutineFin의 date 업데이트 완료');
};


const doneAction = async (req, res, next) => {
  try {
    // 프론트로부터 완료된 액션에 대한 정보 획득, 파라미터로 유저정보 획득
    const userId = res.locals.user.id;
    const { actionId, routineId } = req.body;
    const cycle = await thisCycle(routineId);
    const lastRoutineFinId = await findLastRoutineFinId(routineId, cycle);
    const finDate = new Date();
    // 유저정보와 액션이 정말 일치하는 데이터인지 확인
    const thisActionFin = await ActionFin.findOne({
      where: {
        routineFinId: lastRoutineFinId,
        actionId
      }
    });
    if (!thisActionFin) return next(new Error('현재 액션이 없습니다'));

    //액션에 맞는 ActionFin의 실 데이터 생성
    logger.info('setActionFinDate 진입');
    await setActionFinDate(actionId, lastRoutineFinId, finDate)

    //date가 null인 액션들의 count확인
    const count = await countNullAction(lastRoutineFinId)

    logger.info('date: null인 카운트', count);

    //Action들 속 ActionFin의 Date가 null인 것의 개수가 0보다 크다 === 루틴에 완료되지 않은 액션이 있다.
    if (count > 0) {
      logger.info('액션만 완료된 경우');

      //액션이 완료되었을때 경험치
      if (await upExpFinOneAction(userId)) {
        return res.status(200).send({
          result: 'true1',
          msg: 'Action 완료 날짜 표시, 경험치 지급 완료',
        });
      } else {
        return res.status(200).send({
          result: 'true3',
          msg: 'Action 완료 날짜 표시, 경험치 지급 불가 ( 사유 : 일일 한계 초과 )',
        });
      }
    } else {
      logger.info('액션과 루틴이 함께 완료된 경우');
      //루틴에는 finDate추가
      await setRoutineFinDate(routineId, finDate)

      //액션과 루틴이 함께 완료되었을때 경험치
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
    logger.error(err);
    return next(err);
  }
};

module.exports = {
  chkDayLog,
  calcRoutineExp,
  upDayActionExp,
  upDayRoutineExp,
  doneAction,
};
