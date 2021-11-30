const jwt = require('jsonwebtoken');
const env = require('../env')
const { User, Character } = require('../models');
const { userValidation } = require('./utils/joi');
const { encrypt, compare } = require('./utils/bcrypt');
const myError = require('./utils/httpErrors')
const {
  createRoutineFn
} = require('./utils/routineFn');
const presetConst = require('../constants/presetRoutines')
const logger = require('../logger');

//본인 정보 확인 API
const me = async (req, res, next) => {
  try {
    const { user } = res.locals;
    const character = await Character.findOne({
      where: {
        userId: user.id,
        expMax: 0
      }
    })
    res.status(200).send({ result: true, user, character });
  } catch (err) {
    next(err);
  }
}

//로그아웃 API
const logout = (req, res, next) => {
  try {
    const { providerId } = res.locals.user;

    User.update({ refreshToken: "" }, { where: { providerId } })

    res.status(200).json({ result: true, msg: "로그아웃되었습니다." });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

//로컬 로그인 API
const localLogin = async (req, res, next) => {
  try {
    console.log('로그인 진입')
    const { userEmail, userPw } = req.body;
    const providerId = `local${userEmail}`;

    const user = await User.findOne({ where: { providerId } });
    if (!user) {
      throw new Error('존재하지 않는 아이디입니다.');
    }
    if (!await compare(userPw, user.userPw)) {
      throw new Error('아이디 또는 비밀번호가 틀렸습니다.');
    };
    // refresh token 발급 (2주)
    const refreshToken = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY, {
      expiresIn: "14d",
      issuer: 'mingijuk'
    });

    // access token 발급 (24시간)
    const accessToken = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY, {
      expiresIn: "1h",
      issuer: 'mingijuk'
    });

    await User.update(
      { refreshToken },
      { where: { providerId } }
    );

    return res.status(200).send({ result: true, accessToken, refreshToken, msg: '로그인되었습니다.' });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

//로컬 회원가입 API
const signup = async (req, res, next) => {
  try {
    const { userEmail, userPw, userPwChk, nickName } = await userValidation.validateAsync(req.body);

    const providerId = `local${userEmail}`;

    if (!userEmail || !userPw || !nickName || userEmail === null || userPw === null || nickName === null) {
      throw new Error('입력 정보가 존재하지 않습니다. 개발팀에 문의해주세요');
    }
    // 중복 확인
    if (await User.findOne({ where: { providerId } })) {
      throw new Error('이미 존재하는 이메일입니다.');
    }
    if (await User.findOne({ where: { nickName } })) {
      throw new Error('이미 존재하는 닉네임입니다.');
    }

    //추가 정보
    const provider = 'local';
    const exp = 0;
    const role = 'base_user';

    // 모든 조건 통과 시 비밀번화 단방향 암호화 및 user 생성 encrypt(userPw)
    await User.create({ providerId, userEmail, userPw: encrypt(userPw), nickName, provider, exp, role })
      .then(async (result) => {
        const userId = result.id;
        const presetRoutine1 = presetConst.presetRoutine1;
        const presetRoutine2 = presetConst.presetRoutine2;

        await createRoutineFn(userId, presetRoutine1.routineName, 0, 1, presetRoutine1.actions);
        await createRoutineFn(userId, presetRoutine2.routineName, 0, 1, presetRoutine2.actions);

        return res.status(201).send({ msg: '회원 가입을 축하드립니다.' });
      })
    //회원가입시 프리셋 루틴을 모든 유저에게 생성해주기!
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

module.exports = { logout, localLogin, signup, me };