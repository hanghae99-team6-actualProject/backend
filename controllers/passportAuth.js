const passport = require('passport')
const logger = require('../logger');

const naverLogin = passport.authenticate('naver', {
  scope: ['profile']
});
const kakaoLogin = passport.authenticate('kakao', {
  scope: ['profile_nickname', 'account_email']
});
const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email']
});

const naverCallback = (req, res, next) => {
  passport.authenticate(
    "naver", { failureRedirect: '/' }
    ,
    (err, profile, info) => {
      if (err) return next(err);
      const { refreshToken, accessToken } = info;

      res.redirect(`https://ming-gi-jeog.web.app/sociallogin/refreshToken=${refreshToken}&accessToken=${accessToken}`)
    }
  )(req, res, next);
}

const kakaoCallback = (req, res, next) => {
  passport.authenticate(
    "kakao", { failureRedirect: '/' }
    ,
    (err, profile, info) => {
      logger.info('카카오 로그인 콜백 진입')
      if (err) return next(err);
      const { refreshToken, accessToken } = info;

      res.redirect(`https://ming-gi-jeog.web.app/sociallogin/refreshToken=${refreshToken}&accessToken=${accessToken}`)
    }
  )(req, res, next);
}

const googleCallback = (req, res, next) => {
  passport.authenticate(
    "google", { failureRedirect: '/' }
    ,
    (err, profile, info) => {
      logger.info('네이버 로그인 콜백 진입')
      if (err) return next(err);
      const { refreshToken, accessToken } = info;

      res.redirect(`https://ming-gi-jeog.web.app/sociallogin/refreshToken=${refreshToken}&accessToken=${accessToken}`)
    }
  )(req, res, next);
}


module.exports = { naverLogin, kakaoLogin, googleLogin, naverCallback, kakaoCallback, googleCallback }