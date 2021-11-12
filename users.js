const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { bye, collection, updateUser, setMainRoutine, getMainRoutine, myMoim, myComments } = require('../controllers/users');

const router = express.Router();

router.delete('/bye', authMiddleware, bye);
router.get('/collection', authMiddleware, collection);
router.put('/info', authMiddleware, updateUser);
router.get('/mainRoutine', authMiddleware, getMainRoutine);
router.put('/mainRoutine', authMiddleware, setMainRoutine);

//mypage
router.post('/moims', authMiddleware, myMoim);
router.get('/comments', authMiddleware, myComments);

module.exports = router;