var express = require('express');
var router = express.Router();

const { allPresetRoutine } = require('../controllers/allPresetRoutine');
const { newCharacter } = require('../controllers/newCharacter');
const { doneAction } = require('../controllers/doneAction');

// 프리셋 루틴 전체 목록 불러오기
router.get('/routines', allPresetRoutine);

// 새로운 캐릭터 뽑기
router.post('/:userId', newCharacter);

// 액션(운동) 완료
router.put('/:userId', doneAction);

module.exports = router;
