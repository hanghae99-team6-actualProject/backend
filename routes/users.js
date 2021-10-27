const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { bye, collection, updateUser } = require('../controllers/users')
const router = express.Router();

router.delete('/bye', authMiddleware, bye);
router.get('/collection', authMiddleware, collection);
router.put('/info', authMiddleware, updateUser);

module.exports = router;