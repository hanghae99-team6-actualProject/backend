const passport = require('passport')

const naverLogin = passport.authenticate('naver', {
  scope: ['profile']
});
const kakaoLogin = passport.authenticate('kakao', {
  scope: ['profile_nickname', 'account_email']
});
const googleLogin = passport.authenticate('google', {
  scope: ['profile', 'email']
});

const naverCallbackMiddleware = passport.authenticate('naver',
  { failureRedirect: '/' });
const kakaoCallbackMiddleware = passport.authenticate('kakao',
  { failureRedirect: '/' });
const googleCallbackMiddleware = passport.authenticate('google',
  { failureRedirect: '/' });

const naverCallbackResult = (rea, res) => {
  res.redirect('/')
}
const kakaoCallbackResult = (rea, res) => {
  res.redirect('/')
}
const googleCallbackResult = (rea, res) => {
  res.redirect('/')
}


module.exports = { naverLogin, kakaoLogin, googleLogin, naverCallbackMiddleware, kakaoCallbackMiddleware, googleCallbackMiddleware, naverCallbackResult, kakaoCallbackResult, googleCallbackResult }