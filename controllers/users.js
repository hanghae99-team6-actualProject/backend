require('dotenv').config();
const { User, Character } = require('../models');

//paranoid세팅으로 임시 삭제이기 때문에 node-cron에서 주기적으로 실제 삭제
const bye = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    console.log(id)
    User.destroy({ where: { id } })
      .then(() => {
        res.send({ result: true, msg: "회원 탈퇴가 완료되었습니다" })
      })
      .catch((err) => {
        if (err) return next(new Error('db삭제 오류'))
      })
  } catch (err) {
    return next(err);
  }
}

const collection = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    const usersCharacter = await Character.findAll({
      where: {
        userId: id,
        exp: 1000,
      },
    })
      .then(() => {
        return res.send({ result: true, character: usersCharacter, msg: '성공' });
      }).catch((err) => {
        if (err) return next(new Error('db검색 오류'));
      })
  } catch (err) {
    return next(err);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    if (Object.keys(req.body).length === 0) {
      return next(new Error('수정할 정보가 없습니다.'));
    }
    const { userEmail, nickName, userPw } = req.body;

    User.update({ userEmail, nickName, userPw }, { where: { id } })
      .then(() => {
        return res.send({ result: true, msg: '유저 정보가 수정되었습니다' });
      })
      .catch((err) => {
        if (err) return next(new Error('유저 정보 수정 db 오류'));
      })
  } catch (err) {
    return next(err);
  }
}

module.exports = { bye, collection, updateUser };