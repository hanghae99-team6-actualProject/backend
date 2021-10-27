const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { bye, collection, updateUser } = require('../controllers/users')
const { newCharacter } = require('../controllers/newCharacter');
const { doneAction } = require('../controllers/doneAction');

const router = express.Router();

router.delete('/bye', authMiddleware, bye);
router.get('/collection', authMiddleware, collection);
router.put('/info', authMiddleware, updateUser);
// 새로운 캐릭터 뽑기
router.post('/character/:userId', newCharacter);
// 액션(운동) 완료
router.put('/action/:userId', doneAction);

module.exports = router;