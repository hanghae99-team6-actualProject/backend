var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { getAllNotice, makeNotice, updateNotice, deleteNotice, getTargetNotice } = require('../../controllers/Moim/chats');

router.get('/notices', authMiddleware, getAllNotice);
router.post('/:moimId/:chatRoomId/notice', authMiddleware, makeNotice);
router.get('/:moimId/:chatRoomId/notice', authMiddleware, getTargetNotice);
router.put('/:moimId/:chatRoomId/:noticeId', authMiddleware, updateNotice);
router.delete('/:moimId/:chatRoomId/:noticeId', authMiddleware, deleteNotice);

module.exports = router;