const env = require('../../env')
const { User, Like, Moim, Comment, MoimUser } = require('../../models');
const myError = require('../utils/httpErrors')
const logger = require('../../logger');

//내가 좋아요한 모임 목록
const getLikedMoims = async (req, res, next) => {
  try {
    logger.info('getLikedMoims 라우터 진입');

    const { id: userId } = res.locals.user;
    const likedMoims = await Moim.findAll({
      where: {
        '$MoimUsers.userId$': userId,
        '$Likes.userId$': userId,
      },
      include: [
        {
          model: User,
          attributes: ['nickName'],
        },
      ],
      include: [
        {
          model: MoimUser,
          attributes: ['id', 'userId', 'moimId', 'host'],
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Comment,
          attributes: ['id', 'contents'],
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Like,
          attributes: ['id'],
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        }
      ]
    });
    return res.status(200).send({ result: true, likedMoims });

  } catch (err) {
   next(err);
  }
}

//좋아요 생성 API
const createLike = async (req, res, next) => {
  try {
    logger.info('createLike 라우터 진입');

    const { id: userId } = res.locals.user;
    const { moimId } = req.params;
    const userLike = await Like.findOne({ where: { userId, moimId } });

    if (userLike) {
      return next(new Error('이미 좋아요를 하셨습니다.'));
    }

    await Like.create({ userId, moimId })
      .then(() => { return res.status(200).send({ result: true, msg: `${userId} 유저가 ${moimId} 게시글에 좋아요 생성` }) })

  } catch (err) {
   next(err);
  }
}

//좋아요 삭제 API
const deleteLike = async (req, res, next) => {
  try {
    logger.info('deleteLike 라우터 진입');

    const { id: userId } = res.locals.user;
    const { moimId } = req.params;
    const userLike = await Like.findOne({ userId });

    if (!userLike) {
      return next(new Error('이미 좋아요를 취소하셨습니다.'));
    }
    await Like.destroy({ where: { userId, moimId } })
      .then(() => {
        return res.status(200).send({ result: true, msg: `${userId} 유저가 ${moimId} 게시글에 좋아요 취소` });
      })

  } catch (err) {
   next(err);
  }
}

module.exports = { createLike, getLikedMoims, deleteLike }