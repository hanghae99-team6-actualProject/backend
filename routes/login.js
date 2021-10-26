const express = require('express');
const {
  naverLogin,
  kakaoLogin,
  googleLogin,
  naverCallbackMiddleware,
  kakaoCallbackMiddleware,
  googleCallbackMiddleware,
  naverCallbackResult,
  kakaoCallbackResult,
  googleCallbackResult
} = require('../controllers/passportUser');
// const { localLogin } = require('../controllers/localUser');

const router = express.Router();

router.get('/naver', naverLogin);
router.get('/naver/callback', naverCallbackMiddleware, naverCallbackResult)

router.get('/kakao', kakaoLogin);
router.get('/kakao/callback', kakaoCallbackMiddleware, kakaoCallbackResult)

router.get('/google', googleLogin);
router.get('/google/callback', googleCallbackMiddleware, googleCallbackResult)

// router.get('/', localLogin);

module.exports = router;