const { Routine, RoutineFin, Action, ActionFin, User, Character, Sequelize, sequelize } = require("../../models");
const { timeSet } = require("../utils/timeSet");
const Op = Sequelize.Op;
const logger = require('../../logger');

const getTrackerHistory = async (res, next) => {
  logger.info('getTrackerHistory 진입');
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
    next(err);
  }
};

const getGraphHistory = async (res, next) => {
  logger.info('getGraphHistory 진입');
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
    next(err);
  }
};

module.exports = {
  getTrackerHistory,
  getGraphHistory
};
