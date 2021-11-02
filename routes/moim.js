var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllMoim, createMoim, updateMoim, deleteMoim, enterMoim } = require('../controllers/moims');

//controller import
//const { createLike, getMyLikes, deleteLike } = require('../controllers/like');

//API
// 다만들고 미들웨어 넣기
//모임 전체 불러오기
router.get('/', authMiddleware, getAllMoim);
router.post('/', authMiddleware, createMoim);
router.put('/:moimId', authMiddleware, updateMoim);
router.delete('/:moimId', authMiddleware, deleteMoim);
router.post('/:moimId/:userId', authMiddleware, enterMoim);
module.exports = router;
