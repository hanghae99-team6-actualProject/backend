var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllComments, getTargetMoimComments, createComment, updateComment, deleteComment } = require('../controllers/comments');

//API
router.get('/', authMiddleware, getAllComments);
router.get('/:moimId', authMiddleware, getTargetMoimComments); //특정 모임에 대한 댓글 불러오기
router.post('/:moimId', authMiddleware, createComment);
router.put('/:commentId', authMiddleware, updateComment);
router.delete('/:commentId', authMiddleware, deleteComment);

module.exports = router;