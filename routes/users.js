const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { bye, collection, updateUser, myMoim, enterMoimList, myComments } = require('../controllers/users')
const { newCharacter } = require('../controllers/characters');
const { doneAction } = require('../controllers/actions');

const router = express.Router();

router.delete('/bye', authMiddleware, bye);
router.get('/collection', authMiddleware, collection);
router.put('/info', authMiddleware, updateUser);
// 새로운 캐릭터 뽑기
router.post('/character', authMiddleware, newCharacter);
// 액션(운동) 완료
router.put('/action', authMiddleware, doneAction);
router.get('/moims', authMiddleware, myMoim);
router.get('/comments', authMiddleware, myComments);

module.exports = router;