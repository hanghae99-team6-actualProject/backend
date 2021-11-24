require('dotenv').config();
const { User, Character, Moim, MoimUser, Comment, Routine, Action, Like } = require('../models');
const myError = require('./utils/httpErrors');
const logger = require('../logger');

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
    logger.error(err);
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
        exp: 10000,
      },
    }).catch((err) => {
      logger.error(err);
      if (err) return next(new Error('Character db 검색 에러'));
    })
    return res.send({ result: true, character: usersCharacter, msg: '성공' });
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
        if (err) return next(new Error('유저 정보 수정 db 에러'));
      })
  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

//메인 루틴 설정 API
const setMainRoutine = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  logger.info("setMainRoutine router 진입");
  const { id: userId } = res.locals.user;
  const { routineId } = req.body;

  try {
    //바꾸려는 루틴 확인, 검증용
    const thisRoutine = await Routine.findOne({
      where: { id: routineId },
      include: { model: Action }
    });
    logger.info('thisRoutine', thisRoutine)

    //이전 isMain이 1인 루틴 전부 0으로 수정
    await Routine.update({ isMain: 0 }, {
      where: { userId, isMain: 1 }
    })

    await Routine.update({ isMain: 1 }, {
      where: { id: routineId }
    });
    return res.send({ result: true, msg: "메인 루틴으로 설정하였습니다" });
    // }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

module.exports = { bye, collection, updateUser, setMainRoutine };