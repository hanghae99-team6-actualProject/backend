const { Routine, Action, User, RoutineFin, ActionFin } = require("../../models");
const myError = require('./httpErrors');


//현재 루틴의 가장 최신 RoutineFin의 id를 찾아줍니다!
const findLastRoutineFinId = async (routineId, getCycle) => {
  const cycle = getCycle ? getCycle : await thisCycle(routineId)

  const lastRoutineFin = await RoutineFin.findOne({
    where: {
      routineId,
      cycle
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

module.exports = { findLastRoutineFinId, countNullAction, thisCycle }
