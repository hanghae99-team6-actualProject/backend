var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const { createLike, getMyLikes, deleteLike } = require('../controllers/like');

//API
router.get('/', authMiddleware, getMyLikes);
router.post('/:moimId', authMiddleware, createLike);
router.delete('/:moimId', authMiddleware, deleteLike);

module.exports = router;