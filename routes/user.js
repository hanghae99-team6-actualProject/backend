var express = require('express');
var router = express.Router();
const { allPresetRoutine } = require('../controllers/allPresetRoutine');

//가짜 데이터를 만드는 함수

// 프리셋 루틴 전체 목록 불러오기
router.get('/users/routines', allPresetRoutine);

// 캐릭터 뽑기
router.post('/users/:userId', async (req, res) => {

  return;
});

// 액션 완료
router.put('/users/:userId', async (req, res) => {
  return;
});

module.exports = router;
