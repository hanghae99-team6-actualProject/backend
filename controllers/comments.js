const { Comment, User } = require('../models');
const myError = require('./utils/httpErrors');

const getAllComments = async (req, res, next) => {
  try {
    console.log('getAllComments router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const allComments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: [ 'nickName' ],
        }
      ]
    }).catch((err) => {
      if (err) next(new Error('전체 댓글 불러오기 중 db 에러'));
    });

    console.log('전체 댓글 불러오기 완료');
    return res.status(200).send({
      result: true,
      allComments,
      msg: '전체 댓글 불러오기에 성공했습니다.',
    });
  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
};

const getTargetMoimComments = async (req, res, next) => {
  try {
    console.log('getTargetMoimComments router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const { moimId } = req.params;

    const targetMoimComments = await Comment.findAll({
      where: { moimId },
      include: [
        {
          model: User,
          attributes: [ 'nickName' ],
        }
      ]
    }).catch((err) => {
      if (err) next(new Error('특정 모임 댓글 불러오기 중 db 에러'));
    });

    if (targetMoimComments.length === 0) {
      console.log('특정 모임에 댓글이 없음');
      return res.status(200).send({
        result: 'true2',
        targetMoimComments,
        msg: '특정 모임에 댓글이 존재하지 않습니다.',
      });
    }
    console.log('특정 모임 전체 댓글 불러오기 완료');
    return res.status(200).send({
      result: 'true1',
      targetMoimComments,
      msg: '특정 모임 전체 댓글 불러오기에 성공했습니다.',
    });

  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

const createComment = async (req, res, next) => {
  try {
    console.log('createComment router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;
    const { contents } = req.body;

    await Comment.create({
      userId,
      moimId,
      contents,
    })
      .then((result) => {
        return res.status(200).send({
          result: true,
          newCommentId: result.id,
          msg: '댓글 작성에 성공했습니다.',
        });
      })
      .catch((err) => {
        if (err) next(new Error('댓글 작성 중 db 에러'));
      });
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

const updateComment = async (req, res, next) => {
  try {
    console.log('updateComment router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { commentId } = req.params;
    const { contents } = req.body;

    //1. 먼저 매칭 찾기
    const isComment = await Comment.findOne({
      where: {
        id: commentId,
        userId: userId,
      },
    }).catch((err) => {
      if (err) next(new Error('target 댓글 찾기 중 db 에러'));
    });

    console.log('target', isComment);
    if (!isComment) {
      next(new Error('수정하고자 하는 댓글이 존재하지 않습니다.'));
    }

    await Comment.update(
      { contents },
      { where: { id: commentId, userId: userId } }
    )
      .then(() => {
        return res.status(200).send({
          result: true,
          msg: '댓글 수정에 성공했습니다.',
        });
      })
      .catch((err) => {
        if (err) next(new Error('댓글 수정 중 db 에러'));
      });
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

const deleteComment = async (req, res, next) => {
  try {
    console.log('deleteComment router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { commentId } = req.params;

    const isComment = await Comment.findOne({
      where: {
        id: commentId,
        userId: userId,
      },
    }).catch((err) => {
      if (err) next(new Error('target 댓글 찾기 중 db 에러'));
    });

    console.log('삭제하고자 하는 댓글 정보', isComment);
    if (!isComment) {
      next(new Error('삭제하고자 하는 댓글이 존재하지 않습니다.'));
    }

    await Comment.destroy({
      where: { id: commentId },
    }).then(() => {
        console.log('댓글 삭제완료');
        return res.status(200).send({
          result: true,
          msg: '댓글 삭제에 성공했습니다.',
        });
      })
      .catch((err) => {
        if (err) next(new Error('댓글 삭제 중 db 에러'));
      });
      
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

module.exports = {
  getAllComments,
  getTargetMoimComments,
  createComment,
  updateComment,
  deleteComment,
};
