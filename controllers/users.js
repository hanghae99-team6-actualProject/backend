require('dotenv').config();
const {
  User, Character, Moim, MoimUser, Comment, Routine, Action, Like,
} = require('../models');
const myError = require('./utils/httpErrors');
const { nickNameValidation, userPwValidation } = require('./utils/joi');
const logger = require('../logger');

// paranoid세팅으로 임시 삭제이기 때문에 node-cron에서 주기적으로 실제 삭제
const bye = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    const hostedMoimusers = await MoimUser.findAll({
      where: { userId: id, host: 1 },
    });
    const userArray = hostedMoimusers.map((val) => val.id);
    const myMoims = await Moim.findAll({
      include: [{
        model: MoimUser,
        where: { id: userArray },
      }],
    });
    const moimArray = myMoims.map((val) => val.id);
    await Moim.destroy({
      where: {
        id: moimArray,
      },
    });

    User.destroy({ where: { id } })
      .then(() => {
        res.send({ result: true, msg: '회원 탈퇴가 완료되었습니다' });
      });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

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
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    if (Object.keys(req.body).length === 0) {
      return next(new Error('수정할 정보가 없습니다.'));
    }
    const { userPw, nickName } = req.body;
    await nickNameValidation.validateAsync({ nickName });
    await userPwValidation.validateAsync({ userPw });
    if (await User.findOne({ where: { nickName } })) {
      throw new Error('이미 존재하는 닉네임입니다.');
    }
    User.update({ nickName, userPw }, { where: { id } })
      .then(() => res.send({ result: true, msg: '유저 정보가 수정되었습니다' }));
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

// 메인 루틴 설정 API
const setMainRoutine = async (req, res, next) => {
  console.log('setMainRoutine router 진입');
  const { id: userId } = res.locals.user;
  const { routineId } = req.body;

  try {
    // 바꾸려는 루틴 확인, 검증용
    const thisRoutine = await Routine.findOne({
      where: { id: routineId },
      include: { model: Action },
    });
    console.log('thisRoutine', thisRoutine);

    // 이전 isMain이 1인 루틴 전부 0으로 수정
    await Routine.update({ isMain: 0 }, {
      where: { userId, isMain: 1 },
    });

    await Routine.update({ isMain: 1 }, {
      where: { id: routineId },
    });
    return res.send({ result: true, msg: '메인 루틴으로 설정하였습니다' });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const myMoim = async (req, res, next) => {
  try {
    console.log('myMoin 라우터 진입');
    const userId = res.locals.user.id;
    const { userType } = req.body;
    const hostType = Number(userType);

    const allMyMoim = await MoimUser.findAll({
      where: { userId, host: hostType },
      attributes: ['id', 'userId', 'moimId', 'host'],
      include: [
        {
          model: User,
          attributes: ['nickName'],
        },
        {
          model: Moim,
          attributes: ['id', 'title', 'contents', 'createdAt'],
          include: [
            {
              model: MoimUser,
              attributes: ['id', 'userId', 'moimId', 'host'],
              include: [
                {
                  model: User,
                  attributes: ['nickName'],
                },
              ],
            },
            {
              model: Comment,
              attributes: ['id', 'contents'],
              include: [
                {
                  model: User,
                  attributes: ['nickName'],
                },
              ],
            },
            {
              model: Like,
              attributes: ['id'],
              include: [
                {
                  model: User,
                  attributes: ['nickName'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (hostType === 1) {
      console.log('호스트인 경우');
      console.log(allMyMoim.length);
      if (allMyMoim.length === 0) {
        console.log('개설한 모임이 없습니다.');
        return res.status(200).send({
          result: 'true2',
          msg: '내가 만든 모임이 없습니다.',
        });
      }

      console.log('조회 완료');
      return res.status(200).send({
        result: 'true1',
        allMyMoim,
        msg: '내가 만든 모임 정보 불러오기에 성공했습니다.',
      });
    } if (hostType === 0) {
      console.log('참여자인 경우');
      console.log(allMyMoim.length);
      if (allMyMoim.length === 0) {
        return res.status(200).send({
          result: 'true4',
          msg: '내가 참여한 모임이 없습니다.',
        });
      }

      return res.status(200).send({
        result: 'true3',
        allMyMoim,
        msg: '내가 참여한 모임 정보 불러오기에 성공했습니다.',
      });
    }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const myComments = async (req, res, next) => {
  try {
    console.log('myMoin 라우터 진입');
    const userId = res.locals.user.id;

    const myCommentList = await Comment.findAll({
      where: { userId },
      attributes: ['id', 'userId', 'moimId', 'contents', 'createdAt'],
      include: [
        {
          model: Moim,
          attributes: ['title', 'contents'],
        },
        {
          model: User,
          attributes: ['nickName'],
        },
      ],
    });

    console.log('검색결과를 확인', myCommentList.length);
    if (myCommentList.length === 0) {
      return res.status(200).send({
        result: 'true2',
        msg: '내가 단 댓글이 없습니다. 댓글을 먼저 달아주세요.',
      });
    }

    console.log('댓글 조회 완료');
    return res.status(200).send({
      result: 'true1',
      myCommentList,
      msg: '나의 댓글 목록 정보 조회에 성공했습니다.',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

module.exports = {
  bye, collection, updateUser, setMainRoutine, myMoim, myComments,
};
