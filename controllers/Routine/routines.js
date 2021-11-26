const { Routine, Action, RoutineFin, ActionFin } = require("../models");
const myError = require('./utils/httpErrors');
const {
  findLastRoutineFinId,
  thisCycle,
  countNullAction,
  createActionFn,
  deleteActionFn,
  createRoutineFn
} = require('./utils/routineFn');
const logger = require('../logger');


const { actionExpGrowth, routineExpGrowth, expLimitPerDay } = require('../constants/characters');
const { Action, Character, ExpDayLog, ActionFin, RoutineFin } = require('../models');
const Sequelize = require('sequelize');
const myError = require('./utils/httpErrors');
const { thisCycle, findLastRoutineFinId, countNullAction } = require('./utils/routineFn');
const logger = require('../logger');
const Op = Sequelize.Op;
//--리팩터--
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
    where: { userId, routineId },
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
    ).catch((err) => {
      logger.error(err);
      if (err) throw new Error('upExpFinOneAction 함수 실행 에러 발생');
    });
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
    ).catch((err) => {
      logger.error(err);
      if (err) throw new Error('upExpAllAction 함수 실행 에러 발생');
    });
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
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
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
    })
    //현재 actionFin이 이미 완료되었는지 검증
    if (thisActionFin.date !== null && thisActionFin.date) {
      return next(new Error('이미 완료된 액션인데 왜 들어왔을까요?'));
    }

    //액션에 맞는 ActionFin의 실 데이터 생성
    logger.info('setActionFinDate 진입');
    await setActionFinDate(actionId, lastRoutineFinId, finDate)
      .catch((err) => {
        if (err) next(new Error('setActionFinDate db 에러'));
      });

    //date가 null인 액션들의 count확인
    const count = await countNullAction(lastRoutineFinId)
      .catch((err) => {
        if (err) next(new Error('date null인 ActionFin count db 에러'));
      });

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
      await setRoutineFinDate(routineId, finDate).catch((err) => {
        if (err) return next(new Error('setRoutineFinDate db 에러'));
      });

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


//--리팩터--


//Action 수정 함수
async function modifyAction(routineId, userId, routineFinId, actions) {
  await deleteActionFn(routineId)
    .catch((err) => { if (err) next(new Error('deleteAction db 에러')) })
  await createActionFn(routineId, userId, routineFinId, actions)
    .catch((err) => { if (err) next(new Error('createAction db 에러')) })

  logger.info('action 수정 완료')
}

//루틴 조회 API
const getRoutine = async (req, res, next) => {
  logger.info("getRoutine router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  const { id } = res.locals.user;
  const authId = id

  try {
    const routines = await Routine.findAll({
      where: { userId: authId, preSet: 0 },
      include: [
        {
          model: RoutineFin
        },
        {
          model: Action,
          include: [
            {
              model: ActionFin
            },
          ]
        },
      ]
    });
    res.status(200).send({ result: true, routines, msg: "조회완료" });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

//루틴 생성 API
const createRoutine = async (req, res, next) => {
  logger.info("createRoutine router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  const { id } = res.locals.user;
  const authId = id
  const isMain = 0
  const { routineName, actions } = req.body;

  try {
    //루틴 DB체크
    const routines = await Routine.findAll({
      where: { userId: authId, routineName },
    });
    // 중복된 것이 없다면 루틴 및 루틴fin 데이터를 생성
    if (routines.length > 0) {
      return next(new Error('이미 동일한 이름으로 등록된 루틴이 있습니다.'));
    }
    await createRoutineFn(authId, routineName, isMain, 0, actions)
      .then(() => {
        res.status(200).send({ result: true, msg: '루틴이 생성되었습니다.' });
      })
      .catch((err) => { if (err) next(new Error('actionCreate db 에러')) })
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

//루틴 수정 API
const modifyRoutine = async (req, res, next) => {
  logger.info("modifyRoutine router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  const { id } = res.locals.user;
  const authId = id

  const { routineId } = req.params;
  const { routineName, actions } = req.body;

  try {
    //루틴 DB체크
    const routineExsist = await Routine.findAll({
      where: { id: routineId },
    });

    if (routineExsist.length == 1) {
      await Routine.update(
        {
          routineName,
        },
        {
          where: {
            id: routineId,
          },
        }
      );
      const routineFinId = await findLastRoutineFinId(routineId);
      await modifyAction(routineId, authId, routineFinId, actions);
      return res.status(200).send({ result: true, msg: '루틴이 수정되었습니다.' });
    } else {
      throw new Error('수정 대상 루틴이 없습니다.');
    }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

//루틴 삭제 API
const deleteRoutine = async (req, res, next) => {
  logger.info("deleteRoutine router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  try {
    const { routineId } = req.params;
    await Action.destroy({
      where: { routineId }
    }).catch((err) => { if (err) next(new Error('actionDelete 중 db 에러')) })
    logger.info('routine 종속 action 및 actionFin 삭제완료')

    await Routine.destroy({
      where: { id: routineId }
    })
      .then(() => {
        res.status(200).send({ result: true, routineId, msg: '루틴이 삭제되었습니다.' });
      })
      .catch((err) => { if (err) next(new Error('deleteRoutine 중 db 에러')) })

  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

//현재 루틴 마지막 cycle이 전부 완료되었을 때 새로운 cycle만들기
const createNowRoutineActions = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
    const { routineId } = req.params;
    const lastCycle = await thisCycle(routineId);
    const routineFinId = await findLastRoutineFinId(routineId, lastCycle);
    let newRoutineFinId = 0;
    const getNewRoutineFinId = (input) => newRoutineFinId = input;

    const count = await countNullAction(routineFinId)
      .catch((err) => {
        if (err) next(new Error('date null인 ActionFin count db 에러'));
      });
    logger.info('count', count);
    if (count > 0) return next(myError(400, "이전 액션이 모두 완료되지 않았습니다"));

    const lastActionFins = await ActionFin.findAll(
      { where: { routineFinId } }
    );
    await RoutineFin.create({
      routineId,
      date: null,
      cycle: lastCycle + 1
    })
      .then((result) => {
        getNewRoutineFinId(result.id)
        logger.info('RoutineFin 생성완료')
      })
      .catch((err) => { if (err) next(new Error('RoutineFin 생성 db 에러')) });
    logger.info("newRoutineFinId", newRoutineFinId)

    for await (const [index, value] of lastActionFins.entries()) {
      const { actionId } = value;

      await ActionFin.create({
        actionId: actionId,
        routineFinId: newRoutineFinId,
        date: null
      })
        .then(() => logger.info('ActionFin 생성완료'))
        .catch((err) => { if (err) next(new Error('ActionFin 생성 db 에러')) });
    }
    return res.send({ result: true, msg: "현재 루틴을 재시작합니다" });

  } catch (err) {
    return next(err);
  }
}

//현재 루틴 마지막 Cycle의 액션 findate초기화
const resetNowRoutineActions = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
    const { routineId } = req.params;
    const routineFinId = await findLastRoutineFinId(routineId);

    const targetActionFins = await ActionFin.update(
      { date: null },
      { where: { routineFinId } }
    );
    res.send({ ActionFins: targetActionFins })
  }
  catch (err) {
    return next(err);
  }
}

// 프리셋 루틴 불러오기 API
const allPresetRoutine = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
    const userId = res.locals.user.id;
    const routines = await Routine.findAll({
      where: { userId, preSet: 1 },
      include: [
        {
          model: RoutineFin,
        },
        {
          model: Action,
          include: [
            {
              model: ActionFin
            }
          ]
        },
      ],
    });
    logger.info("전체 프리셋 루틴 불러오기 완료");

    return res.status(200).send({
      result: true,
      routines,
      msg: '프리셋 루틴 목록 불러오기 완료',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};


//메인 루틴 설정 API
const setMainRoutine = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  logger.info("setMainRoutine router 진입");
  const { id: userId } = res.locals.user;
  const { routineId } = req.body;

  try {
    //바꾸려는 루틴 확인, 검증용
    const thisRoutine = await Routine.findOne({
      where: { id: routineId },
      include: { model: Action }
    });
    logger.info('thisRoutine', thisRoutine)

    //이전 isMain이 1인 루틴 전부 0으로 수정
    await Routine.update({ isMain: 0 }, {
      where: { userId, isMain: 1 }
    });

    await Routine.update({ isMain: 1 }, {
      where: { id: routineId }
    });
    return res.send({ result: true, msg: "메인 루틴으로 설정하였습니다" });
    // }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};


module.exports = {
  getRoutine,
  createRoutine,
  modifyRoutine,
  deleteRoutine,
  createNowRoutineActions,
  resetNowRoutineActions,
  allPresetRoutine,
  chkDayLog,
  calcRoutineExp,
  upDayActionExp,
  upDayRoutineExp,
  doneAction,
  setMainRoutine
};
