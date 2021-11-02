var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllMoim, createMoim, updateMoim, deleteMoim, enterMoim } = require('../controllers/moims');

//API
router.get('/', authMiddleware, getAllMoim);
router.post('/', authMiddleware, createMoim);
router.put('/:moimId', authMiddleware, updateMoim);
router.delete('/:moimId', authMiddleware, deleteMoim);
router.post('/:moimId', authMiddleware, enterMoim);
module.exports = router;
