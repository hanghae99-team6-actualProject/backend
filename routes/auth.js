const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { logout, signup, me, localLogin } = require('../controllers/auth')
const {
  naverLogin,
  kakaoLogin,
  googleLogin,
  naverCallback,
  kakaoCallback,
  googleCallback,
} = require('../controllers/passportAuth');

const router = express.Router();

router.get('/me', authMiddleware, me);
router.get('/logout', authMiddleware, logout);
router.post('/signup', signup)

//아래부터 로그인
router.post('/local', localLogin);

router.get('/naver', naverLogin);
router.get('/naver/callback', naverCallback)

router.get('/kakao', kakaoLogin);
router.get('/kakao/callback', kakaoCallback)

router.get('/google', googleLogin);
router.get('/google/callback', googleCallback)


module.exports = router;