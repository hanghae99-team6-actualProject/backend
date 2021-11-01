var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const { createLike, getMyLikes } = require('../controllers/like');

//API
router.get('/', authMiddleware, getMyLikes);
router.post('/', authMiddleware, createLike);
// router.put('/:routineId', authMiddleware, routineModify);
// router.delete('/:routineId', authMiddleware, routineDelete);

module.exports = router;