const { Routine, Action, User, Character, Sequelize } = require("../models");
const myError = require("./utils/httpErrors");
const Op = Sequelize.Op;

//메인 루틴, 액션, 유저 조회
const ongoingGet = async (req, res, next) => {
  console.log("routineGet router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  const { id } = res.locals.user;

  try {
    const users = await User.findAll({
      where: { id },
      attributes: {
      },
      include: [{
        model: Character,
      }, {
        model: Routine,
        where: { isMain: 1 },
        include: [{
          model: Action
        }]
      }]
    });
    res.status(200).send({ result: true, users, msg: "진행중 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "진행중 정보 조회 에러 발생"));
  }
};

const historyGet = async (req, res, next) => {
  console.log("routineGet router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  const { id } = res.locals.user;
  const authId = id

  try {
    const finRoutines = await Routine.findAll({
      where: {
        userId: authId,
        findate: {
          [Op.not]: null
        }
      },
    });
    const finActions = await Action.findAll({
      where: {
        userId: authId,
        findate: {
          [Op.not]: null
        }
      },
    });
    res.status(200).send({ result: true, finRoutines, finActions, msg: "히스토리 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "히스토리 정보 조회 에러 발생"));
  }
};

module.exports = {
  ongoingGet,
  historyGet
};
