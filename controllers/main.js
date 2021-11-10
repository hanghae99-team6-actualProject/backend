const { Routine, RoutineFin, Action, ActionFin, User, Character, Sequelize, sequelize } = require("../models");
const myError = require("./utils/httpErrors");
const Op = Sequelize.Op;

const today = new Date();
const year = today.getFullYear(); // 년도
const month = today.getMonth(); // 월
const date = today.getDate();  // 날짜
const fromThisMonth = new Date(year, month, 1, 0, 0, 0);
const fromYearAgo = new Date(year - 1, month, date, 0, 0, 0);

//메인 루틴, 액션, 유저 조회
const ongoingGet = async (req, res, next) => {
  console.log("routineGet router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  const { id: userId } = res.locals.user;

  try {
    const presetMainRoutine = await Routine.findAll({
      where: { userId: null, isMain: 1 },
      include: [{
        model: Action
      }]
    });
    if (presetMainRoutine.length === 1) {
      return res.status(200).send({ result: true, mainRoutine: presetMainRoutine, msg: "진행중 루틴 및 액션 조회완료" });
    }
    else if (presetMainRoutine.length === 0) {
      const userMainRoutine = await Routine.findAll({
        where: { userId, isMain: 1 },
        include: [{
          model: Action,
          include: [{
            model: ActionFin
          }]
        }, {
          model: RoutineFin
        }]
      })
      const userCharacter = await Character.findOne({
        where: { userId, expMax: 0 }
      });
      return res.status(200).send({ result: true, mainRoutine: userMainRoutine, character: userCharacter, msg: "진행중 루틴 및 액션 조회완료" });
    }
    else {
      return next(new Error('2개 이상의 루틴이 mainRoutine인 상황, 서버 에러'))
    }

  } catch (err) {
    console.log(err);
    return next(new Error("진행중 정보 조회 에러 발생"));
  }
};

const trackerHistoryGet = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  const { id } = res.locals.user;
  const authId = id

  try {
    const finUser = await User.findOne({
      attributes: ['id', 'createdAt'],
      where: { id: authId },
    });

    const finRoutines = await Routine.findAll({
      // attributes: ['userId'],
      where: { userId: authId },
      include: [
        {
          model: RoutineFin,
          where: {
            date: {
              [Op.not]: null,
              [Op.gte]: fromThisMonth
            }
          }
        }
      ]
    });

    const finActions = await Action.findAll({
      // attributes: ['userId'],
      where: { userId: authId },
      include: [
        {
          model: ActionFin,
          where: {
            date: {
              [Op.not]: null,
              [Op.gte]: fromThisMonth
            }
          }
        }
      ]
    });

    res.status(200).send({ result: true, finUser, finRoutines, finActions, msg: "해빗트래커 히스토리 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "해빗트래커 히스토리 정보 조회 에러 발생"));
  }
};

const graphHistoryGet = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  const { id } = res.locals.user;
  const authId = id
  console.log('아이디체크체크');
  console.log(authId);

  try {
    const finUser = await User.findOne({
      attributes: ['id', 'createdAt'],
      where: { id: authId },
    });

    const finRoutines = await Routine.findAll({
      // attributes: ['userId'],
      where: { userId: authId },
      include: [
        {
          model: RoutineFin,
          where: {
            date: {
              [Op.not]: null,
              [Op.gte]: fromYearAgo
            }
          }
        }
      ]
    });

    const finActions = await Action.findAll({
      // attributes: ['userId'],
      where: { userId: authId },
      include: [
        {
          model: ActionFin,
          where: {
            date: {
              [Op.not]: null,
              [Op.gte]: fromYearAgo
            }
          }
        }
      ]
    });
    res.status(200).send({ result: true, finUser, finRoutines, finActions, msg: "그래프 히스토리 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "그래프 히스토리 정보 조회 에러 발생"));
  }
};

module.exports = {
  ongoingGet,
  trackerHistoryGet,
  graphHistoryGet
};
