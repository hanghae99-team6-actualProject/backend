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

//Action 수정 함수
async function modifyAction(routineId, userId, routineFinId, actions) {
  await deleteActionFn(routineId)
    .catch((err) => { if (err) next(new Error('deleteAction db 에러')) })
  await createActionFn(routineId, userId, routineFinId, actions)
    .catch((err) => { if (err) next(new Error('createAction db 에러')) })

  console.log('action 수정 완료')
}

//루틴 조회 API
const getRoutine = async (req, res, next) => {
  console.log("getRoutine router 진입");
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
    console.log(err);
    return next(err);
  }
};

//루틴 생성 API
const createRoutine = async (req, res, next) => {
  console.log("createRoutine router 진입");
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
    console.log(err);
    return next(err);
  }
};

//루틴 수정 API
const modifyRoutine = async (req, res, next) => {
  console.log("modifyRoutine router 진입");
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
    console.log(err);
    return next(err);
  }
};

//루틴 삭제 API
const deleteRoutine = async (req, res, next) => {
  console.log("deleteRoutine router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  try {
    const { routineId } = req.params;
    await Action.destroy({
      where: { routineId }
    }).catch((err) => { if (err) next(new Error('actionDelete 중 db 에러')) })
    console.log('routine 종속 action 및 actionFin 삭제완료')

    await Routine.destroy({
      where: { id: routineId }
    })
      .then(() => {
        res.status(200).send({ result: true, routineId, msg: '루틴이 삭제되었습니다.' });
      })
      .catch((err) => { if (err) next(new Error('deleteRoutine 중 db 에러')) })

  } catch (err) {
    console.log(err);
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
    console.log('count', count);
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
        console.log('RoutineFin 생성완료')
      })
      .catch((err) => { if (err) next(new Error('RoutineFin 생성 db 에러')) });
    console.log("newRoutineFinId", newRoutineFinId)

    for await (const [index, value] of lastActionFins.entries()) {
      const { actionId } = value;

      await ActionFin.create({
        actionId: actionId,
        routineFinId: newRoutineFinId,
        date: null
      })
        .then(() => console.log('ActionFin 생성완료'))
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
    console.log(targetActionFins);
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
    console.log("전체 프리셋 루틴 불러오기 완료!");

    return res.status(200).send({
      result: true,
      routines,
      msg: '프리셋 루틴 목록 불러오기 완료',
    });
  } catch (err) {
    console.log(err);
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
  allPresetRoutine
};
