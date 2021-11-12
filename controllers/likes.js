const env = require('../env')
const { User, Like, Moim } = require('../models');
const myError = require('./utils/httpErrors')

//내가 좋아요한 모임 목록
const getMyLikes = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

    const { id: userId } = res.locals.user;
    const myLikes = await Like.findAll({
      where: {
        userId
      },
      include: [{
        model: Moim
      }]
    });
    return res.status(200).send({ result: true, myLikes });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

//좋아요 생성 API
const createLike = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { id: userId } = res.locals.user;
    const { moimId } = req.params;
    const userLike = await Like.findAll({ where: { userId, moimId } });
    if (userLike.length > 0) {
      return next(new Error('이미 좋아요를 하셨습니다.'));
    }
    await Like.create({ userId, moimId })
      .then(() => { return res.status(200).send({ result: true, msg: `${userId} 유저가 ${moimId} 게시글에 좋아요 생성` }) })
      .catch((err) => { if (err) return next(new Error('like 생성 db 에러')); })
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

//좋아요 삭제 API
const deleteLike = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
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
      .catch((err) => { if (err) return next(new Error('deleteLike db 에러')) });
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = { createLike, getMyLikes, deleteLike }
