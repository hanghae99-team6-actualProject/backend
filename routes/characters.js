const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { createCharacter, getCharacter } = require('../controllers/characters');

const router = express.Router();

// 새로운 캐릭터 뽑기
router.post('/', authMiddleware, createCharacter);
router.get('/', authMiddleware, getCharacter);

module.exports = router;