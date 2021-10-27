require('dotenv').config();
const { User, Character } = require('../models');

//TODO
//paranoid세팅으로 임시 삭제이기 때문에 moment(아마) 시간 다루는 api에서 주기적으로 실제 삭제 예정
//https://runebook.dev/ko/docs/sequelize/manual/paranoid
const bye = async (req, res) => {
  try {
    const { id } = res.locals.user;
    console.log(id)
    User.destroy({ where: { id } })
      .then(() => {
        res.send({ result: true, msg: "회원 탈퇴가 완료되었습니다" })
      })
      .catch((err) => {
        if (err) throw new Error('db삭제 오류')
      })
  } catch (err) {
    res.send({ result: false, msg: err.message })
  }
}

const collection = async (req, res) => {
  try {
    const { id } = res.locals.user;
    const usersCharacter = await Character.findAll({
      where: {
        userId: id,
        exp: 1000,
      },
    }).catch((err) => {
      if (err) throw new Error('db검색 오류')
    })
    return res.send({ result: true, character: usersCharacter, msg: '성공' });
  } catch (err) {
    return res.send({ result: false, msg: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = res.locals.user;
    if (Object.keys(req.body).length === 0) {
      throw new Error('수정할 정보가 없습니다.')
    }
    const { userEmail, nickName, userPw } = req.body;

    User.update({ userEmail, nickName, userPw }, { where: { id } })
      .catch((err) => {
        if (err) throw new Error('db수정 오류')
      })
    return res.send({ result: true, msg: '유저 정보가 수정되었습니다' });
  } catch (err) {
    return res.send({ result: false, msg: err.message })
  }
}

module.exports = { bye, collection, updateUser };