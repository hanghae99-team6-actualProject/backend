const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { bye, collection, updateUser, setMainRoutine, myMoim, enterMoimList, myComments } = require('../controllers/users');

const router = express.Router();

router.delete('/bye', authMiddleware, bye);
router.get('/collection', authMiddleware, collection);
router.put('/info', authMiddleware, updateUser);
router.put('/mainRoutine', authMiddleware, setMainRoutine);

module.exports = router;