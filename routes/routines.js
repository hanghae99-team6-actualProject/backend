var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const { routineGet, routineCreate, routineModify, routineDelete } = require('../controllers/routinesCtrl');
const { allPresetRoutine } = require('../controllers/allPresetRoutine');

//API
router.get('/', authMiddleware, routineGet);
router.post('/', authMiddleware, routineCreate);
router.put('/:routineId', authMiddleware, routineModify);
router.delete('/:routineId', authMiddleware, routineDelete);
// 프리셋 루틴 전체 목록 불러오기
router.get('/preset', allPresetRoutine);

module.exports = router;