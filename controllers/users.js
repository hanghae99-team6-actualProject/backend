require('dotenv').config();
const { User, Character } = require('../models');

//paranoid세팅으로 임시 삭제이기 때문에 node-cron에서 주기적으로 실제 삭제
const bye = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { id } = res.locals.user;
    User.destroy({ where: { id } })
      .then(() => {
        res.send({ result: true, msg: "회원 탈퇴가 완료되었습니다" })
      })
      .catch((err) => {
        if (err) return next(new Error('User db삭제 에러'))
      })
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

const collection = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { id } = res.locals.user;
    const usersCharacter = await Character.findAll({
      where: {
        userId: id,
        exp: 1000,
      },
    }).catch((err) => {
      console.log(err);
      if (err) return next(new Error('Character db 검색 에러'));
    })
    return res.send({ result: true, character: usersCharacter, msg: '성공' });
  } catch (err) {
    return next(err);
  }
}

const updateUser = async (req, res, next) => {
  try {
    console.log(req.file);
    const { id } = res.locals.user;
    if (Object.keys(req.body).length === 0 || !req.file) {
      return next(new Error('수정할 정보가 없습니다.'));
    }
    const { userEmail, nickName, userPw } = req.body;
    const file = req.file;

    User.update({ userEmail, nickName, userPw, avatarUrl: file?.location }, { where: { id } })
      .then(() => {
        return res.send({ result: true, msg: '유저 정보가 수정되었습니다' });
      })
      .catch((err) => {
        if (err) return next(new Error('유저 정보 수정 db 에러'));
      })
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = { bye, collection, updateUser };