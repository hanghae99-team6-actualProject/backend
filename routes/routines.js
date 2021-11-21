var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const { getRoutine,
  createRoutine,
  modifyRoutine,
  deleteRoutine,
  createNowRoutineActions,
  resetNowRoutineActions,
  allPresetRoutine } = require('../controllers/routines');

//API
router.post('/create/:routineId', authMiddleware, createNowRoutineActions);
router.put('/reset/:routineId', authMiddleware, resetNowRoutineActions);
// 프리셋 루틴 전체 목록 불러오기
router.get('/preset', authMiddleware, allPresetRoutine);

router.put('/:routineId', authMiddleware, modifyRoutine);
router.delete('/:routineId', authMiddleware, deleteRoutine);
router.get('/', authMiddleware, getRoutine);
router.post('/', authMiddleware, createRoutine);

module.exports = router;