const { Routine, RoutineFin, Action, ActionFin, User, Character, Sequelize, sequelize } = require("../models");
const myError = require("./utils/httpErrors");
const Op = Sequelize.Op;
const logger = require('../logger');

function timeSet() {
  const today = new Date();
  const year = today.getFullYear(); // 년도
  const month = today.getMonth(); // 월
  const day = today.getDate();  // 날짜
  const fromThisMonth = new Date(year, month, 1, 0, 0, 0);
  const fromYearAgo = new Date(year - 1, month, day, 0, 0, 0);

  return { fromThisMonth, fromYearAgo }
}

//메인 루틴, 액션, 유저 조회
const getOngoing = async (req, res, next) => {
  logger.info("getRoutine router 진입");
  const { id: userId } = res.locals.user;

  try {
    const presetMainRoutine = await Routine.findAll({
      where: { userId: null, isMain: 1, isDel: 0 },
      include: [{
        model: Action
      }]
    });
    if (presetMainRoutine.length === 1) {
      return res.status(200).send({ result: true, mainRoutine: presetMainRoutine, msg: "진행중 루틴 및 액션 조회완료" });
    }
    else if (presetMainRoutine.length === 0) {
      const userMainRoutine = await Routine.findOne({
        where: { userId, isMain: 1, isDel: 0 },
        include: [{
          model: Action,
          include: [{
            model: ActionFin
          }]
        }, {
          model: RoutineFin
        }]
      })

      if (!userMainRoutine) return res.status(200).send({
        result: false,
        msg: "진행중인 루틴이 없습니다."
      });

      const userCharacter = await Character.findOne({
        where: { userId, expMax: 0 }
      });

      return res.status(200).send({
        result: true,
        mainRoutine: userMainRoutine,
        character: userCharacter,
        msg: "진행중 루틴 및 액션 조회완료"
      });
    }
    else {
      return next(new Error('2개 이상의 루틴이 mainRoutine인 상황, 서버 에러'))
    }

  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const getTrackerHistory = async (req, res, next) => {
  const { id } = res.locals.user;
  const authId = id

  const { fromThisMonth } = timeSet();

  try {
    const finUser = await User.findOne({
      attributes: ['id', 'createdAt'],
      where: { id: authId },
    });

    const finRoutines = await Routine.findAll({
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
    logger.error(err);
    next(err);
  }
};

const getGraphHistory = async (req, res, next) => {
  const { id } = res.locals.user;
  const authId = id

  const { fromYearAgo } = timeSet();

  try {
    const finUser = await User.findOne({
      attributes: ['id', 'createdAt'],
      where: { id: authId },
    });

    const finRoutines = await Routine.findAll({
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
    logger.error(err);
    next(err);
  }
};

module.exports = {
  getOngoing,
  getTrackerHistory,
  getGraphHistory
};