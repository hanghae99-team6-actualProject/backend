const { Comment, User, Moim } = require('../models');
const myError = require('./utils/httpErrors');
const logger = require('../logger');

const getAllComments = async (req, res, next) => {
  try {
    logger.info('getAllComments router 진입');
    const allComments = await Comment.findAll({
      include: [
        {
          model: User,
          attributes: ['nickName'],
        }
      ]
    });

    logger.info('전체 댓글 불러오기 완료');
    return res.status(200).send({
      result: true,
      allComments,
      msg: '전체 댓글 불러오기에 성공했습니다.',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const getTargetMoimComments = async (req, res, next) => {
  try {
    logger.info('getTargetMoimComments router 진입');
    const { moimId } = req.params;

    const targetMoimComments = await Comment.findAll({
      where: { moimId },
      include: [
        {
          model: User,
          attributes: ['nickName'],
        }
      ]
    })

    if (targetMoimComments.length === 0) {
      logger.info('특정 모임에 댓글이 없음');
      return res.status(200).send({
        result: 'true2',
        targetMoimComments,
        msg: '특정 모임에 댓글이 존재하지 않습니다.',
      });
    }
    logger.info('특정 모임 전체 댓글 불러오기 완료');
    return res.status(200).send({
      result: 'true1',
      targetMoimComments,
      msg: '특정 모임 전체 댓글 불러오기에 성공했습니다.',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const createComment = async (req, res, next) => {
  try {
    logger.info('createComment router 진입');
    const userId = res.locals.user.id;
    const { moimId } = req.params;
    const { contents } = req.body;

    if (contents.length > 50) {
      return next(myError(400, "글자수는 50자 이하만 가능합니다"));
    }

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
      });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    logger.info('updateComment router 진입');
    const userId = res.locals.user.id;
    const { commentId } = req.params;
    const { contents } = req.body;

    //1. 먼저 매칭 찾기
    const isComment = await Comment.findOne({
      where: {
        id: commentId,
        userId: userId,
      },
    });

    logger.info('target', isComment);
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
      });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    logger.info('deleteComment router 진입');
    const userId = res.locals.user.id;
    const { commentId } = req.params;

    const isComment = await Comment.findOne({
      where: {
        id: commentId,
        userId: userId,
      },
    });

    logger.info('삭제하고자 하는 댓글 정보', isComment);
    if (!isComment) {
      next(new Error('삭제하고자 하는 댓글이 존재하지 않습니다.'));
    }

    await Comment.destroy({
      where: { id: commentId },
    }).then(() => {
      logger.info('댓글 삭제완료');
      return res.status(200).send({
        result: true,
        msg: '댓글 삭제에 성공했습니다.',
      });
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
};



const myComments = async (req, res, next) => {
  try {
    logger.info('myComments 라우터 진입');
    const userId = res.locals.user.id;

    const myCommentList = await Comment.findAll({
      where: { userId: userId },
      attributes: ['id', 'userId', 'moimId', 'contents', 'createdAt'],
      include: [
        {
          model: Moim,
          attributes: ['title', 'contents'],
        },
        {
          model: User,
          attributes: ['nickName'],
        }
      ]
    });

    logger.info('검색결과를 확인', myCommentList.length);
    if (myCommentList.length === 0) {
      return res.status(200).send({
        result: 'true2',
        msg: '내가 단 댓글이 없습니다. 댓글을 먼저 달아주세요.'
      })
    }

    logger.info('댓글 조회 완료')
    return res.status(200).send({
      result: 'true1',
      myCommentList,
      msg: '나의 댓글 목록 정보 조회에 성공했습니다.'
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

module.exports = {
  getAllComments,
  getTargetMoimComments,
  createComment,
  updateComment,
  deleteComment,
  myComments
};