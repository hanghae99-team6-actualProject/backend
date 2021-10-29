const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware')
const { logout, localSignup, me, localLogin } = require('../controllers/auth')
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
} = require('../controllers/passportAuth');

const router = express.Router();

router.get("/debug", (req, res) => {
  res.json({
    "req.session": req.session,
    "req.user": req.user,

    // passport 정보를 들여다 보자
    "req._passport": req._passport,
  })
})

router.get('/me', authMiddleware, me);
router.get('/logout', authMiddleware, logout);
router.post('/signup', localSignup)


//아래부터 로그인
router.post('/local', localLogin);

router.get('/naver', naverLogin);
router.get('/naver/callback', naverCallbackMiddleware, naverCallbackResult)

router.get('/kakao', kakaoLogin);
router.get('/kakao/callback', kakaoCallbackMiddleware, kakaoCallbackResult)

router.get('/google', googleLogin);
router.get('/google/callback', googleCallbackMiddleware, googleCallbackResult)


module.exports = router;