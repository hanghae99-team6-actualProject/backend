var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getAllComments, getTargetMoimComments, createComment, updateComment, deleteComment, myComments } = require('../../controllers/Moim/comments');

router.get('/comment/mycomments', authMiddleware, myComments);
router.get('/comment/:moimId', authMiddleware, getTargetMoimComments); //특정 모임에 대한 댓글 불러오기
router.post('/comment/:moimId', authMiddleware, createComment);
router.put('/comment/:commentId', authMiddleware, updateComment);
router.delete('/comment/:commentId', authMiddleware, deleteComment);
router.get('/comment/', authMiddleware, getAllComments);

module.exports = router;