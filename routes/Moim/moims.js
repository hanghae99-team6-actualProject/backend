var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getAllMoim, getMoimByLocation, detailMoim, createMoim, updateMoim, deleteMoim, enterMoim, exitMoim, myMoims } = require('../../controllers/Moim/moims');

router.post('/mymoims', authMiddleware, myMoims);
router.post('/search', getMoimByLocation); //미들웨어 제거
router.post('/:moimId/exit', authMiddleware, exitMoim);
router.get('/:moimId', authMiddleware, detailMoim);
router.put('/:moimId', authMiddleware, updateMoim);
router.delete('/:moimId', authMiddleware, deleteMoim);
router.post('/:moimId', authMiddleware, enterMoim);
router.get('/', getAllMoim); //미들웨어 제거
router.post('/', authMiddleware, createMoim);

module.exports = router;