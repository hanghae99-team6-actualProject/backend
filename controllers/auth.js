const jwt = require('jsonwebtoken');
const env = require('../env')
const { User } = require('../models');
const userValidation = require('./utils/joi');
const { encryptPw, pwCompare } = require('./utils/bcrypt');
const myError = require('./utils/httpErrors')

//본인 정보 확인 API
const me = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { user } = res.locals;
    console.log(user);
    res.status(200).send({ result: true, user });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

//로그아웃 API
const logout = (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { providerId } = res.locals.user;

    User.update({ refreshToken: "" }, { where: { providerId } })
      .catch((err) => { return next(new Error('User.update refreshToken db 에러')) })

    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      req.logout()
    })

    res.status(200).json({ result: true, msg: "로그아웃되었습니다." });
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

//로컬 로그인 API
const localLogin = async (req, res, next) => {
  try {
    const { userEmail, userPw } = req.body;
    const providerId = `local${userEmail}`

    const user = await User.findOne({ where: { providerId } });

    if (!user) {
      throw new Error('존재하지 않는 아이디입니다.');
    }
    if (!pwCompare(userPw, user.userPw)) {
      throw new Error('아이디 또는 비밀번호가 틀렸습니다.');
    }
    // const token = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY);

    // refresh token 발급 (2주)
    const refreshToken = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY, {
      expiresIn: "14d",
      issuer: 'mingijuk'
    });

    // access token 발급 (24시간)
    const accessToken = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY, {
      expiresIn: "24h",
      issuer: 'mingijuk'
    });

    await User.update(
      { refreshToken },
      { where: { providerId } }
    ).catch((err) => { if (err) return next(myError(401, 'User.update refreshToken db 에러')) });

    return res.status(200).send({ result: true, accessToken, refreshToken, msg: '로그인되었습니다.' });
  } catch (err) {
    console.log(err);
    return next(myError(401, err.message));
  }
}

//로컬 회원가입 API
const localSignup = async (req, res, next) => {
  try {
    const { userEmail, userPw, userPwChk, nickName } = await userValidation.validateAsync(req.body);

    const providerId = `local${userEmail}`

    //혹시나 해서 만듬
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

    // 모든 조건 통과 시 비밀번화 단방향 암호화 및 user 생성 encryptPw(userPw)
    await User.create({ providerId, userEmail, userPw: encryptPw(userPw), nickName, provider, exp, role })
      .then(() => {
        return res.status(201).send({ msg: '회원 가입을 축하드립니다.' });
      })
      .catch((err) => {
        if (err) return next(new Error("User 생성 db 에러"));
      });
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

module.exports = { logout, localLogin, localSignup, me };