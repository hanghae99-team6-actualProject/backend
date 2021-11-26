var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const { createLike, getLikedMoims, deleteLike } = require('../../controllers/Moim/likes');

router.get('/like/mylikes', authMiddleware, getLikedMoims);
router.post('/like/:moimId', authMiddleware, createLike);
router.delete('/like/:moimId', authMiddleware, deleteLike);

module.exports = router;