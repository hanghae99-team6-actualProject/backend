const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;



const { User } = require('./models');

const dotenv = require("dotenv");
dotenv.config();

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((profile, done) => {
    done(null, profile);
  })

  passport.deserializeUser((profile, done) => {
    done(null, profile);
  })

  passport.use(new NaverStrategy({
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: '/login/naver/callback'
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
    clientID: process.env.KAKAO_CLIENT_ID,
    callbackURL: '/login/kakao/callback'
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
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/login/google/callback'
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

