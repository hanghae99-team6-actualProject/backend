const { Routine, Action, User, RoutineFin, ActionFin } = require("../models");
const actionfin = require("../models/actionfin");
const myError = require('./utils/httpErrors');
const {
  findLastRoutineFinId,
  thisCycle,
  countNullAction,
  createActionFn,
  deleteActionFn,
  createRoutineFn
} = require('./utils/routineFn');

//--Action 수정 함수--
//해당 루틴 아이디 기준 다 지우고 만든다. 왜?
//루틴 내 액션들이 로우별로 아이디 값 고유하게 갖고 있는 상태임
//이 때 루틴 아이디만으로 아이디 특정해서 바꾼다고 한들, 액션갯수가 계속 달라질 수 있으므로 지우고 만드는게 직관적임
async function actionModify(routineId, userId, routineFinId, actions) {
  await deleteActionFn(routineId)
    .catch((err) => { if (err) next(new Error('deleteAction db 에러')) })
  await createActionFn(routineId, userId, routineFinId, actions)
    .catch((err) => { if (err) next(new Error('createAction db 에러')) })

  console.log('action 수정 완료')
}

//루틴 조회 API
const routineGet = async (req, res, next) => {
  console.log("routineGet router 진입");
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
    return next(myError(400, "조회 catch 에러 발생"));
  }
};

//루틴 생성 API
const routineCreate = async (req, res, next) => {
  console.log("routineCreate router 진입");
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
    // 중복된 것이 없다면 루틴 및 루틴핀 데이터를 생성
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
const routineModify = async (req, res, next) => {
  console.log("routineModify router 진입");
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
      await actionModify(routineId, authId, routineFinId, actions);
      return res.status(200).send({ result: true, msg: '루틴이 수정되었습니다.' });
    } else {
      throw new Error('수정 대상 루틴이 없습니다.');
    }
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

//루틴 삭제 API
const routineDelete = async (req, res, next) => {
  console.log("routineDelete router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  // const { id } = res.locals.user;
  // const authId = id

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
      .catch((err) => { if (err) next(new Error('routineDelete 중 db 에러')) })

  } catch (err) {
    console.log(err);
    return next(myError(500, err.message));
  }
};

//현재 루틴 마지막 cycle이 전부 완료되었을 때 새로운 cycle만들기
const createNowRoutineActions = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
    const userId = res.locals.user.id;
    const { routineId } = req.params;
    const lastCycle = await thisCycle(routineId);
    const routineFinId = await findLastRoutineFinId(routineId, lastCycle);
    let newRoutineFinId = 0;
    const getNewRoutineFinId = (input) => newRoutineFinId = input;

    console.log('lastCycle', lastCycle)
    console.log('routineFinId', routineFinId)
    //4. date가 null인 액션들의 count확인
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
      const { id, routineFinId, actionId, date } = value;

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
    const userId = res.locals.user.id;
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
    console.log(routines);
    console.log("전체 프리셋 루틴 불러오기 완료!");

    return res.status(200).send({
      result: true,
      routines,
      msg: '프리셋 루틴 목록 불러오기 완료',
    });
  } catch (error) {
    console.log(error);
    return next(myError(400, '알 수 없는 오류 발생',
    ));
  }
};


module.exports = {
  routineGet,
  routineCreate,
  routineModify,
  routineDelete,
  createNowRoutineActions,
  resetNowRoutineActions,
  allPresetRoutine
};
