const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const env = require('../env')
const { User } = require('../models');
const userValidation = require('./utils/joi')

//본인 정보 확인 API
const me = async (req, res) => {
  try {
    const { user } = res.locals;
    if (!user || user === null) {
      throw new Error('로그인되어있지 않습니다! 현재 로그인상태에서만 사용가능하니 이 에러는 발생하면 안됩니다');
    }
    console.log(user);
    res.send({ user });
  } catch (err) {
    res.send({ result: false, msg: err.message });
  }
}

//로그아웃 API
const logout = (req, res) => {
  try {
    const { id } = res.locals.user;
    if (!id) throw new Error('유저 id없음');

    User.update({ refreshToken: "" }, { where: { id } })
      .catch((err) => { throw new Error('User.update refreshToken 실패') })

    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      req.logout()
    })

    res.json({ result: true, msg: "로그아웃되었습니다." });
  } catch (error) {
    res.status(400).json({ msg: "fail" });
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
    if (!(await bcrypt.compare(userPw, user.userPw))) {
      throw new Error('아이디 또는 비밀번호가 틀렸습니다.');
    }
    // const token = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY);

    // refresh token 발급 (2주)
    const refreshToken = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY, {
      expiresIn: "14d",
    });


    // access token 발급 (24시간)
    const accessToken = jwt.sign({ providerId: user.providerId }, env.JWT_SECRET_KEY, {
      expiresIn: "24h",
    });

    await User.update(
      { refreshToken },
      { where: { providerId } }
    ).catch((err) => { throw new Error('User.update refreshToken 실패') });

    return res.send({ result: true, accessToken, refreshToken, msg: '로그인되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(401).send({ result: false, msg: err.message });
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

    // 모든 조건 통과 시 비밀번화 단방향 암호화 및 user 생성
    const encryptPw = bcrypt.hashSync(userPw, Number(env.SALT));

    //추가 정보
    const provider = 'local';
    const exp = 0;
    const role = 'base_user';

    await User.create({ providerId, userEmail, userPw: encryptPw, nickName, provider, exp, role })
      .then(() => {
        return res.send({ msg: '회원 가입을 축하드립니다.' });
      })
      .catch((err) => {
        if (err) throw new Error("db생성 실패에러, 개발팀에 문의해주세요");
      });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ result: false, msg: err.message })
  }
};

module.exports = { logout, localLogin, localSignup, me };