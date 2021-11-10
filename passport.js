const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('./env')

const { User } = require('./models');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((profile, done) => {
    done(null, profile);
  })

  passport.deserializeUser((profile, done) => {
    done(null, profile);
  })
  console.log(env.NAVER_CLIENT_ID);

  passport.use(new ({
    clientID: env.NAVER_CLIENT_ID,
    clientSecret: env.NAVER_CLIENT_SECRET,
    callbackURL: `${env.DOMAIN}/api/auth/naver/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile?.id;
      const userEmail = profile?._json?.email;
      const nickName = profile?.displayName;
      const provider = 'naver';
      const exp = 0;
      const role = 'base_user';
      if (!providerId) {
        next(null, false, { msg: 'providerId 검증 오류' });
      }
      let user = await User.findOne({ where: { providerId } });
      if (!user) {
        user = await User.create({ providerId, userEmail, nickName, provider, exp, role })
      }
      done(null, profile)
    } catch (err) {
      console.log(err);
      return done(err);
    }
  }))

  passport.use(new KakaoStrategy({
    clientID: env.KAKAO_CLIENT_ID,
    callbackURL: `${env.DOMAIN}/api/auth/kakao/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile?.id;
      const userEmail = profile?._json?.kakao_account?.email;
      const nickName = profile.displayName;
      const provider = 'kakao';
      const exp = 0;
      const role = 'base_user';
      if (!providerId) {
        next(null, false, { msg: 'providerId 검증 오류' });
      }
      let user = await User.findOne({ where: { providerId } });
      if (!user) {
        user = await User.create({ providerId, userEmail, nickName, provider, exp, role })
      }
      done(null, profile)
    } catch (err) {
      console.log(err);
      return done(err);
    }
  }))

  passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env.DOMAIN}/api/auth/google/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const providerId = profile?.id;
      const userEmail = profile?._json?.email;
      const nickName = profile.displayName;
      const provider = 'google';
      const exp = 0;
      const role = 'base_user';
      if (!providerId) {
        next(null, false, { msg: 'providerId 검증 오류' });
      }
      let user = await User.findOne({ where: { providerId } });
      if (!user) {
        user = await User.create({ providerId, userEmail, nickName, provider, exp, role })
      }
      done(null, profile)
    } catch (err) {
      console.log(err);
      return done(err);
    }
  }))
}

