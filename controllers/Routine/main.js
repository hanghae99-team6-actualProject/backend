const {
  Routine,
  RoutineFin,
  Action,
  ActionFin,
  User,
  Character,
  Sequelize,
  sequelize
} = require('../../models');
const myError = require('../utils/httpErrors');
const Op = Sequelize.Op;
const logger = require('../../logger');

//메인 루틴, 액션, 유저 조회
const getOngoing = async (res, next) => {
  logger.info('getRoutine router 진입');
  const { id: userId } = res.locals.user;

  try {
    const presetMainRoutine = await Routine.findAll({
      where: { userId: null, isMain: 1 },
      include: [
        {
          model: Action
        }
      ]
    });
    if (presetMainRoutine.length === 1) {
      return res.status(200).send({
        result: true,
        mainRoutine: presetMainRoutine,
        msg: '진행중 루틴 및 액션 조회완료'
      });
    } else if (presetMainRoutine.length === 0) {
      const userMainRoutine = await Routine.findAll({
        where: { userId, isMain: 1 },
        include: [
          {
            model: Action,
            include: [
              {
                model: ActionFin
              }
            ]
          },
          {
            model: RoutineFin
          }
        ]
      });
      const userCharacter = await Character.findOne({
        where: { userId, expMax: 0 }
      });
      return res.status(200).send({
        result: true,
        mainRoutine: userMainRoutine,
        character: userCharacter,
        msg: '진행중 루틴 및 액션 조회완료'
      });
    } else {
      return next(new Error('2개 이상의 루틴이 mainRoutine인 상황, 서버 에러'));
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOngoing
};
