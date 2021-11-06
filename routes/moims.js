var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllMoim, detailMoim, createMoim, updateMoim, deleteMoim, enterMoim, exitMoim } = require('../controllers/moims');

//API
router.get('/', getAllMoim); //미들웨어 제거
router.post('/', authMiddleware, createMoim);
router.get('/:moimId', authMiddleware, detailMoim);
router.put('/:moimId', authMiddleware, updateMoim);
router.delete('/:moimId', authMiddleware, deleteMoim);
router.post('/:moimId', authMiddleware, enterMoim);
router.post('/:moimId/exit', authMiddleware, exitMoim);
module.exports = router;
