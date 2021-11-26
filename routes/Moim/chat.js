var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { createChatRoom, enterChatRoom, exitChatRoom, deleteChatRoom, loadTargetChat, saveChat } = require('../../controllers/Moim/chats');

router.post('/:moimId/chatRoom', authMiddleware, createChatRoom)
router.post('/:moimId/chatRoom/enter', authMiddleware, enterChatRoom)
router.delete('/:moimId/:chatRoomId/exit', authMiddleware, exitChatRoom);
router.put('/:moimId/:chatRoomId', authMiddleware, deleteChatRoom);
router.get('/:moimId/:chatRoomId', authMiddleware, loadTargetChat);
router.post('/:moimId/:chatRoomId', authMiddleware, saveChat);

module.exports = router;