const presetConst = require('../../../constants/presetRoutines');

const makePreset = async (userId) => {
  const presetRoutine1 = presetConst.presetRoutine1;
  const presetRoutine2 = presetConst.presetRoutine2;

  await createRoutineFn(userId, presetRoutine1.routineName, 0, 1, presetRoutine1.actions);
  await createRoutineFn(userId, presetRoutine2.routineName, 0, 1, presetRoutine2.actions);
}

module.exports = makePreset;