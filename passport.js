const passport = require('passport');
const jwt = require('jsonwebtoken');
const NaverStrategy = require('passport-naver').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { Op } = require('sequelize');
const env = require('./env');
const {
  createRoutineFn,
} = require('./controllers/utils/routineFn');
const presetConst = require('./constants/presetRoutines');
const { User } = require('./models');

module.exports = (app) => {
  app.use(passport.initialize());

  passport.use(new NaverStrategy({
    clientID: env.NAVER_CLIENT_ID,
    clientSecret: env.NAVER_CLIENT_SECRET,
    callbackURL: `${env.DOMAIN}/api/auth/naver/callback`,
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

      if (await User.findOne({
        where: {
          providerId,
          deletedAt: {
            [Op.not]: null,
          },
        },
      })) {
        next(null, false, { msg: '회원 탈퇴 후 14일 이전에는 동일 ID 사용이 불가능합니다.' });
      }
      let user = await User.findOne({ where: { providerId } });
      if (!user) {
        user = await User.create({
          providerId, userEmail, nickName, provider, exp, role,
        })
          .then(async (result) => {
            const userId = result.id;
            const { presetRoutine1 } = presetConst;
            const { presetRoutine2 } = presetConst;

            await createRoutineFn(userId, presetRoutine1.routineName, 0, 1, presetRoutine1.actions);
            await createRoutineFn(userId, presetRoutine2.routineName, 0, 1, presetRoutine2.actions);
          });
        console.log('유저가 없어 회원가입됩니다', user);
      } else {
        console.log('유저가 이미 있어 로그인합니다', user);
      }

      // refresh token 발급 (2주)
      const refreshToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
        expiresIn: '14d',
        issuer: 'mingijuk',
      });

      // access token 발급 (24시간)
      const accessToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
        expiresIn: '1h',
        issuer: 'mingijuk',
      });

      await User.update(
        { refreshToken },
        { where: { providerId: providerId.toString() } },
      );

      done(null, profile, {
        refreshToken,
        accessToken,
      });
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new KakaoStrategy({
    clientID: env.KAKAO_CLIENT_ID,
    callbackURL: `${env.DOMAIN}/api/auth/kakao/callback`,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('passport kakao 진입');
      const providerId = profile?.id;
      const userEmail = profile?._json?.kakao_account?.email;
      const nickName = profile.displayName;
      const provider = 'kakao';
      const exp = 0;
      const role = 'base_user';
      if (!providerId) {
        next(null, false, { msg: 'providerId 검증 오류' });
      }
      if (await User.findOne({
        where: {
          providerId,
          deletedAt: {
            [Op.not]: null,
          },
        },
      })) {
        next(null, false, { msg: '회원 탈퇴 후 14일 이전에는 동일 ID 사용이 불가능합니다.' });
      }
      let user = await User.findOne({ where: { providerId } });
      if (!user) {
        user = await User.create({
          providerId, userEmail, nickName, provider, exp, role,
        })
          .then(async (result) => {
            const userId = result.id;
            const { presetRoutine1 } = presetConst;
            const { presetRoutine2 } = presetConst;

            await createRoutineFn(userId, presetRoutine1.routineName, 0, 1, presetRoutine1.actions);
            await createRoutineFn(userId, presetRoutine2.routineName, 0, 1, presetRoutine2.actions);
          });
        console.log('유저가 없어 회원가입됩니다', user);
      } else {
        console.log('유저가 이미 있어 로그인합니다', user);
      }

      // refresh token 발급 (2주)
      const refreshToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
        expiresIn: '14d',
        issuer: 'mingijuk',
      });

      // access token 발급 (24시간)
      const accessToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
        expiresIn: '1h',
        issuer: 'mingijuk',
      });

      await User.update(
        { refreshToken },
        { where: { providerId: providerId.toString() } },
      );
      done(null, profile, {
        refreshToken,
        accessToken,
      });
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${env.DOMAIN}/api/auth/google/callback`,
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
      if (await User.findOne({
        where: {
          providerId,
          deletedAt: {
            [Op.not]: null,
          },
        },
      })) {
        next(null, false, { msg: '회원 탈퇴 후 14일 이전에는 동일 ID 사용이 불가능합니다.' });
      }
      let user = await User.findOne({ where: { providerId } });
      if (!user) {
        user = await User.create({
          providerId, userEmail, nickName, provider, exp, role,
        })
          .then(async (result) => {
            const userId = result.id;
            const { presetRoutine1 } = presetConst;
            const { presetRoutine2 } = presetConst;

            await createRoutineFn(userId, presetRoutine1.routineName, 0, 1, presetRoutine1.actions);
            await createRoutineFn(userId, presetRoutine2.routineName, 0, 1, presetRoutine2.actions);
          });
        console.log('유저가 없어 회원가입됩니다', user);
      } else {
        console.log('유저가 이미 있어 로그인합니다', user);
      }
      // refresh token 발급 (2주)
      const refreshToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
        expiresIn: '14d',
        issuer: 'mingijuk',
      });

      // access token 발급 (24시간)
      const accessToken = jwt.sign({ providerId }, env.JWT_SECRET_KEY, {
        expiresIn: '1h',
        issuer: 'mingijuk',
      });

      await User.update(
        { refreshToken },
        { where: { providerId: providerId.toString() } },
      );

      done(null, profile, {
        refreshToken,
        accessToken,
      });
    } catch (err) {
      return done(err);
    }
  }));
};
