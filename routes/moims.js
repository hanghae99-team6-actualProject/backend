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

//likes moved
//controller import
const { createLike, getMyLikes, deleteLike } = require('../controllers/likes');

//API
router.get('/like/', authMiddleware, getMyLikes);
router.post('/like/:moimId', authMiddleware, createLike);
router.delete('/like/:moimId', authMiddleware, deleteLike);

//comments moved
//controller import
const { getAllComments, getTargetMoimComments, createComment, updateComment, deleteComment } = require('../controllers/comments');

//API
router.get('/comment/', authMiddleware, getAllComments);
router.get('/comment/:moimId', authMiddleware, getTargetMoimComments); //특정 모임에 대한 댓글 불러오기
router.post('/comment/:moimId', authMiddleware, createComment);
router.put('/comment/:commentId', authMiddleware, updateComment);
router.delete('/comment/:commentId', authMiddleware, deleteComment);

// chat
const { createChatRoom, enterChatRoom, outChatRoom, deleteChatRoom, loadTargetChat, saveChat } = require('../controllers/chats');

//API
router.post('/:moimId/chatRoom', authMiddleware, createChatRoom) 
router.get('/:moimId/chatRoom', authMiddleware, enterChatRoom)
router.delete('/:moimId/chatRoom', authMiddleware, outChatRoom);
router.delete('/:moimId/:chatRoomId', authMiddleware, deleteChatRoom);
router.get('/:moimId/:chatRoomId', authMiddleware, loadTargetChat);
router.post('/:moimId/:chatRoomId', authMiddleware, saveChat);

module.exports = router;