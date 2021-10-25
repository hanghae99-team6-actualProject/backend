var express = require('express');
var router = express.Router();
// const models = require('../models');
const { Routine,  Action, Character  } = require('../models');

//가짜 데이터를 만드는 함수

// 프리셋 루틴 전체 목록 불러오기
router.get('/users/routines', async (req, res) => {
  try {
    const routines = await Routine.findAll();
    console.log(routines);
    console.log("전체 불러오기 완료!");

    return res.status(200).send({
      routines: routines,
      msg: '목록 불러오기 완료',
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send({
      msg: '알 수 없는 오류 발생',
    });
  }
});

// 캐릭터 뽑기
router.post('/users/:userId', async (req, res) => {

  return;
});

// 액션 완료
router.put('/users/:userId', async (req, res) => {
  return;
});

module.exports = router;
