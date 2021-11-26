var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllMoim, getMoimByLocation, getMoreMoim, getMoreMoimByLocation, detailMoim, createMoim, updateMoim, deleteMoim, enterMoim, exitMoim, myMoims } = require('../controllers/moims');
const { createLike, getLikedMoims, deleteLike } = require('../controllers/likes');
const { getAllComments, getTargetMoimComments, createComment, updateComment, deleteComment, myComments } = require('../controllers/comments');

//API
router.get('/like/mylikes', authMiddleware, getLikedMoims);
router.post('/like/:moimId', authMiddleware, createLike);
router.delete('/like/:moimId', authMiddleware, deleteLike);

router.get('/comment/mycomments', authMiddleware, myComments);
router.get('/comment/:moimId', authMiddleware, getTargetMoimComments); //특정 모임에 대한 댓글 불러오기
router.post('/comment/:moimId', authMiddleware, createComment);
router.put('/comment/:commentId', authMiddleware, updateComment);
router.delete('/comment/:commentId', authMiddleware, deleteComment);
router.get('/comment/', authMiddleware, getAllComments);

router.post('/mymoims', authMiddleware, myMoims);
router.post('/search', getMoimByLocation); //미들웨어 제거
router.post('/scroll/:lastId', getMoreMoim); //미들웨어 제거
router.post('/scroll-location/:lastId', getMoreMoimByLocation); //미들웨어 제거
router.post('/:moimId/exit', authMiddleware, exitMoim);
router.get('/:moimId', authMiddleware, detailMoim);
router.put('/:moimId', authMiddleware, updateMoim);
router.delete('/:moimId', authMiddleware, deleteMoim);
router.post('/:moimId', authMiddleware, enterMoim);
router.get('/', getAllMoim); //미들웨어 제거
router.post('/', authMiddleware, createMoim);

// chat
const { createChatRoom, enterChatRoom, exitChatRoom, deleteChatRoom, loadTargetChat, saveChat, getAllNotice, makeNotice, updateNotice, deleteNotice, getTargetNotice } = require('../controllers/chats');

//API
router.post('/:moimId/chatRoom', authMiddleware, createChatRoom)
router.post('/:moimId/chatRoom/enter', authMiddleware, enterChatRoom)
router.delete('/:moimId/:chatRoomId/exit', authMiddleware, exitChatRoom);
router.put('/:moimId/:chatRoomId', authMiddleware, deleteChatRoom);
router.get('/:moimId/:chatRoomId', authMiddleware, loadTargetChat);
router.post('/:moimId/:chatRoomId', authMiddleware, saveChat);

// router.get('/notices', authMiddleware, getAllNotice); 현재 사용 하지 않음!
router.post('/:moimId/:chatRoomId/notice', authMiddleware, makeNotice);
router.get('/:moimId/:chatRoomId/notice', authMiddleware, getTargetNotice);
router.put('/:moimId/:chatRoomId/:noticeId', authMiddleware, updateNotice);
router.delete('/:moimId/:chatRoomId/:noticeId', authMiddleware, deleteNotice);

module.exports = router;