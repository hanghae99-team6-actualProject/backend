const env = require('../env')
const { User, Like } = require('../models');
const myError = require('./utils/httpErrors')

//좋아요 생성 API
const createLike = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { id: userId } = res.locals.user;
    const { id: boardId } = req.body;

    Like.create({ userId, boardId })
      .then(() => res.send({ result: true, msg: `${userId} 유저가 ${boardId} 게시글에 좋아요를 함` }))
      .catch((err) => { if (err) next(new Error('like 생성 db 에러')); })
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

const getMyLikes = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

    const { id: userId } = res.locals.user;
    const { id: boardId } = req.body;

  } catch (err) {
    console.log(err);
    return next(err);
  }
}

module.exports = { createLike, getMyLikes }