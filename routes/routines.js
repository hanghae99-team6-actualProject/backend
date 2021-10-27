var express = require('express');
var router = express.Router();

//controller import
const { routineGet, routineCreate, routineModify, routineDelete } = require('../controllers/routinesCtrl');
const { allPresetRoutine } = require('../controllers/allPresetRoutine');

//API
router.get('/', routineGet);
router.post('/', routineCreate);
router.put('/:routineId', routineModify);
router.delete('/:routineId', routineDelete);
// 프리셋 루틴 전체 목록 불러오기
router.get('/preset', allPresetRoutine);

module.exports = router;