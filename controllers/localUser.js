// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
require('dotenv').config();
// const { User } = require('../../models');
// const userValidation = requie('../utils/joi')

// const localLogin = (req, res, next) => {
//   try {
//     const { email, pw } = req.body;
//     const user = await User.findOne({ where: { providerId: `local${email}` } });

//     if (!user) {
//       return res.status(401).send({ msg: '존재하지 않는 아이디입니다.' });
//     }
//     if (!(await bcrypt.compare(pw, user.pw))) {
//       return res.status(401).send({ msg: '아이디 또는 비밀번호가 틀렸습니다.' });
//     }
//     const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
//     res.send({ token, msg: '로그인되었습니다.' });
//   } catch (err) {
//     console.log(err);
//     res.status(401).send({ msg: '로그인에 실패하셨습니다.' });
//   }
// }

const localSignup = async (req, res, next) => {
  try {
    const { email, pw, nickname } = await userValidation.validateAsync(req.body);

    // 존재하는 아이디 중복 체크
    if (await User.findOne({ where: { email } })) {
      res.status(409).send({ msg: '이미 존재하는 아이디입니다.' });
    }
    if (await User.findOne({ where: { nickname } })) {
      res.status(409).send({ msg: '이미 존재하는 닉네임입니다.' });
    }

    const providerId = `local${email}`
    const userEmail = email;
    const provider = 'local';
    const exp = 0;
    const role = 'base_user';
    // 모든 조건 통과 시 비밀번화 단방향 암호화 및 user 생성
    const encryptPw = bcrypt.hashSync(pw);

    await User.create({ providerId, userEmail, pw: encryptPw, nickname, provider, exp, role }, (err, user) => {
      if (err) return res.status(400).send(err);
      res.send({ msg: '회원 가입을 축하드립니다.' });
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: err.message })
  }
};

module.exports = { localSignup };