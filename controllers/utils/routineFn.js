const { Routine, Action, User, RoutineFin, ActionFin } = require("../../models");
const myError = require('./httpErrors');


//현재 루틴의 가장 최신 RoutineFin의 id를 찾아줍니다!
const findLastRoutineFinId = async (routineId, getCycle) => {
  const cycle = getCycle ? getCycle : await thisCycle(routineId)
  console.log(routineId);
  console.log(cycle);
  const lastRoutineFin = await RoutineFin.findOne({
    where: {
      routineId,
      cycle,
    }
  });

  return lastRoutineFin.id;
}

//현재 루틴의 가장 최신 사이클을 찾아줍니다!
const thisCycle = async (routineId) => {
  let cycle = 0;
  const getcycle = (input) => {
    cycle = input;
  }
  await RoutineFin.max('cycle', { where: { routineId: routineId } })
    .then((val) => getcycle(val))
  return cycle;
}


const countNullAction = async (routineFinId) => {
  return await ActionFin.count({
    where: { routineFinId, date: null }
  })
}

//--Action 생성,  함수--
const createActionFn = async (routineId, userId, routineFinId, actions) => {
  console.log(actions);
  for await (const [index, value] of actions.entries()) {
    console.log(index, value);
    const { actionName, actionCnt, actionType } = value;
    await Action.create({
      routineId,
      userId,
      actionName,
      actionCnt,
      actionType,
      actionNum: index,
      isDel: 0,
    })
      .then(async (result) => {
        console.log((result.actionCnt + 1) + '번째 AnctionFin 생성');
        await ActionFin.create({
          actionId: result.id,
          routineFinId
        })
      })
  }
  console.log('action 생성 완료')
}


//--Action 삭제 함수--
const deleteActionFn = async (routineId) => {
  await Action.update(
    { isDel: 1 },
    { where: { routineId } },
  )
  console.log('action 및 연관 actionfin 삭제 완료')
  // 액션의 isDel에 1값이 추가되면서 데이터는 보존, 삭제 처리
}

const createRoutineFn = async (authId, routineName, isMain, preSet, actions) => {
  const routines = await Routine.create({
    userId: authId,
    routineName,
    isMain,
    preSet,
    isDel: 0,
  }).catch((err) => { next(new Error('Routine 생성 중 db 에러')) })

  const routineFin = await RoutineFin.create({
    routineId: routines.id,
    cycle: 1
  });

  const { id: routineId } = routines;
  const { id: routineFinId } = routineFin;
  await createActionFn(routineId, authId, routineFinId, actions)
  console.log('routine 및 actions, actionfin 생성 완료')
}

module.exports = {
  findLastRoutineFinId,
  countNullAction,
  thisCycle,
  createActionFn,
  deleteActionFn,
  createRoutineFn
}
