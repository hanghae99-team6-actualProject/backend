require('dotenv').config();
const { User, Character, Routine, Action } = require('../../models');
const logger = require('../../logger');
const myError = require('../utils/httpErrors');

//paranoid세팅으로 임시 삭제이기 때문에 node-cron에서 주기적으로 실제 삭제
const bye = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    User.destroy({ where: { id } })
      .then(() => {
        res.send({ result: true, msg: "회원 탈퇴가 완료되었습니다" })
      });
  } catch (err) {
    next(err);
  }
}

const collection = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    const usersCharacter = await Character.findAll({
      where: {
        userId: id,
        exp: 10000,
      },
    });
    return res.send({ result: true, character: usersCharacter, msg: '성공' });
  } catch (err) {
    next(err);
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
      });
  } catch (err) {
    return next(err);
  }
}

//메인 루틴 설정 API
const setMainRoutine = async (req, res, next) => {
  logger.info("setMainRoutine router 진입");
  const { id: userId } = res.locals.user;
  const { routineId } = req.body;

  try {
    //바꾸려는 루틴 확인, 검증용
    const thisRoutine = await Routine.findOne({
      where: { id: routineId },
    });
    if (!thisRoutine) return next(myError(400, '루틴id 에러'));

    //이전 isMain이 1인 루틴 전부 0으로 수정
    await Routine.update({ isMain: 0 }, {
      where: { userId, isMain: 1 }
    });

    await Routine.update({ isMain: 1 }, {
      where: { id: routineId }
    });
    return res.send({ result: true, msg: "메인 루틴으로 설정하였습니다" });
    // }
  } catch (err) {
    return next(err);
  }
};

module.exports = { bye, collection, updateUser, setMainRoutine };
