const { Moim, MoimUser, Comment, Like, User } = require('../models');
const myError = require('./utils/httpErrors');
const logger = require('../logger');

const makeMoimUser = async (userId, moimId, userType, next) => {
  //모임의 유저를 만드는 함수
  try {
    await MoimUser.create({
      userId,
      moimId,
      host: userType,
    });
    if (userType === 1) {
      logger.info('host 유저생성 완료');
    } else if (userType === 0) {
      logger.info('nomal 유저생성 완료');
    }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const getAllMoim = async (req, res, next) => {
  try {
    logger.info('getAllMoim router 진입');

    const allMoims = await Moim.findAll({
      include: [
        {
          model: MoimUser,
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Like,
        },
      ],
    })
    //catch가 두 군데서  걸려서 이중리턴 에러 발생함
    // .catch((err) => {
    //   if (err) next(new Error('전체 모임정보 불러오기 중 db 에러'));
    // });

    return res.status(200).send({
      result: true,
      allMoims,
      msg: '전체 모임정보 불러오기에 성공했습니다.',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const getMoimByLocation = async (req, res, next) => {
  try {
    logger.info('getMoimByLocation router 진입');
    const { filter } = req.body;
    console.log(req.body);

    const filterMoims = await Moim.findAll({
      where: { filter },
      include: [
        {
          model: MoimUser,
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Like,
        },
      ],
    })
    //catch가 두 군데서  걸려서 이중리턴 에러 발생함
    // .catch((err) => {
    //   if (err) next(new Error('전체 모임정보 불러오기 중 db 에러'));
    // });

    return res.status(200).send({
      result: true,
      filterMoims,
      msg: '선택한 구 기준 모임정보 불러오기에 성공했습니다.',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const createMoim = async (req, res, next) => {
  try {
    logger.info('createMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { title, contents, imgSrc, location, filter, startAt, finishAt } = req.body;

    // 생성 중복검사
    const isMoim = await Moim.findAll({
      where: {
        title: title,
        contents: contents,
      }
    })

    // 모임 db데이터 생성
    await Moim.create({
      title,
      contents,
      imgSrc,
      location,
      filter,
      startAt,
      finishAt
    })
      .then(async (result) => {
        // 생성된 모임의 호스트 데이터 생성
        await makeMoimUser(userId, result.id, 1);
        return res.status(200)
          .send({ result: true, msg: '모임과 호스트가 생성되었습니다.' });
      })
      .catch((err) => {
        if (err) next(new Error('create 중 db 에러'));
      });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const detailMoim = async (req, res, next) => {
  try {
    logger.info('detailMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const { moimId } = req.params;

    const targetMoim = await Moim.findOne({
      where: { id: moimId },
      include: [
        {
          model: MoimUser,
          include: [
            {
              model: User,
              attributes: ['nickName'],
            },
          ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['nickName'],
            }
          ]
        },
        {
          model: Like
        },
      ]
    }).catch((err) => {
      if (err) next(new Error("타겟 모임 조회 db 에러"))
    })

    logger.info('디테일이 필요한 모임 정보', targetMoim)
    if (targetMoim === null) {
      return next(new Error('모임 정보가 존재하지 않습니다. 먼저 모임 등록을 하시기바랍니다.'))
    }

    logger.info('타겟 모임 조회 완료')
    return res.status(200).send({
      result: true,
      targetMoim,
      msg: '특정 모임의 정보 불러오기에 성공했습니다.'
    })

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const updateMoim = async (req, res, next) => {
  try {
    logger.info('updateMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;
    const { title, contents, imgSrc, location, filter, startAt, finishAt } = req.body;

    //1. find?
    const targetMoim = await Moim.findAll({
      where: { id: moimId },
      include: [
        {
          model: MoimUser,
          attributes: ['userId']
        }
      ]
    }).catch((err) => {
      logger.error('update의 targetMoim find 중 db 에러');
      if (err) next(new Error('update의 targetMoim find 중 db 에러'));
    });

    if (targetMoim[0].MoimUsers[0].userId !== userId) {
      return next(new Error('모임의 작성자만 수정이 가능합니다.'))
    }

    if (targetMoim.length > 0) {
      //2. update 실행
      await Moim.update(
        {
          title,
          contents,
          imgSrc,
          location,
          filter,
          startAt,
          finishAt
        },
        {
          where: { id: moimId },
        }
      )
        .then((result) => {
          return res.status(200).send({
            result: true,
            msg: '모임 정보 수정에 성공했습니다.',
          });
        })
        .catch((err) => {
          logger.info('updateMiom db 에러');
          if (err) next(new Error('updateMiom db 에러'));
        });
    } else {
      logger.info('수정할 모임이 없습니다.');
      next(new Error('수정할 모임이 없습니다.')); //이렇게 쓰는 것이 맞는가?!
    }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const deleteMoim = async (req, res, next) => {
  try {
    logger.info('deleteMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;

    const targetMoim = await await Moim.findAll({
      where: { id: moimId },
      include: [
        {
          model: MoimUser,
          attributes: ['userId']
        }
      ]
    }).catch((err) => {
      if (err) next(new Error('delete의 targetMoim find 중 db 에러'));
    });

    if (targetMoim[0].MoimUsers[0].userId !== userId) {
      return next(new Error('모임의 작성자만 삭제가 가능합니다.'))
    }

    if (targetMoim.length > 0) {
      await Moim.destroy({
        where: { id: moimId },
      })
        .then(() => {
          return res.status(200).send({
            result: true,
            msg: '모임 삭제에 성공했습니다.',
          });
        })
        .catch((err) => {
          console.log(err);
          if (err) next(new Error('모임 삭제 db 실행 에러 발생'));
        });
    } else {
      next(new Error('삭제할 대상이 존재하지 않습니다.'));
    }
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const enterMoim = async (req, res, next) => {
  try {
    logger.info('enterMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;
    //모임 기간이 지났는지 확인
    const thisMoim = await Moim.findOne({ where: { id: moimId } });
    const now = new Date();

    if (now > thisMoim.finishAt) {
      return next(new Error('이미 기간이 지난 모임입니다'));
    }

    //이미 참가한 모임인지 확인
    const isUser = await MoimUser.findOne({
      where: {
        userId: userId,
        moimId,
      }
    });

    if (isUser) {
      return next(new Error('이미 참가중인 모임입니다.'));
    }

    await makeMoimUser(userId, moimId, 0); //host가 아닌 참가자 생성

    return res.status(200).send({
      result: true,
      msg: '모임 참가자 생성에 성공했습니다.',
    });
  } catch (err) {
    logger.error(err);
    return next(err);
  }
};

const exitMoim = async (req, res, next) => {
  try {
    logger.info('enterMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;

    const isEnterMoim = await MoimUser.findOne({
      where: { userId: userId, moimId },
      include: [
        {
          model: User,
          attributes: ['nickName']
        },
      ]
    }).catch((err) => { if (err) next(new Error('모임 참가 유저 검색 중 db 에러')) });

    const exitUserNickName = isEnterMoim.User.nickName;

    if (!isEnterMoim) {
      return next(new Error('이미 비참가중인 모임입니다.'));
    }

    const exitMoim = await MoimUser.destroy({
      where: { userId: userId, moimId }
    }).catch((err) => { if (err) next(new Error('모임 참가 취소 중 db 에러')) });

    if (exitMoim !== 1) {
      return next(new Error('모임 참가 취소 중 원인을 알 수 없는 에러 발생. 관리자에게 문의 바랍니다.'));
    }

    return res.status(200).send({
      result: true,
      msg: '참가 취소 성공',
      exitUserNickName
    })

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}


const myMoims = async (req, res, next) => {
  try {
    logger.info('myMoims 라우터 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

    const userId = res.locals.user.id;
    const userType = req.body.userType;
    const hostType = Number(userType)

    const allMyMoims = await MoimUser.findAll({
      where: {
        userId,
        host: userType,
      },
      include: [{
        model: Moim,
        include: [
          {
            model: MoimUser,
            include: [
              {
                model: User,
              }
            ]
          },
          {
            model: Comment,
            include: [
              {
                model: User,
              }
            ]
          },
          {
            model: Like,
            include: [
              {
                model: User,
              }
            ]
          }
        ]
      }]
    });

    if (hostType === 1) {
      logger.info('호스트인 경우')
      logger.info(allMyMoims.length);
      if (allMyMoims.length === 0) {
        logger.info('개설한 모임이 없습니다.');
        return res.status(200).send({
          result: "true2",
          msg: '내가 만든 모임이 없습니다.'
        })
      }

      logger.info('조회 완료')
      return res.status(200).send({
        result: "true1",
        allMyMoims,
        msg: '내가 만든 모임 정보 불러오기에 성공했습니다.'
      })
    } else if (hostType === 0) {
      logger.info('참여자인 경우')
      logger.info(allMyMoims.length);
      if (allMyMoims.length === 0) {
        logger.info('참여한 모임이 없습니다.');
        return res.status(200).send({
          result: "true4",
          msg: '내가 참여한 모임이 없습니다.'
        })
      }

      return res.status(200).send({
        result: "true3",
        allMyMoims,
        msg: '내가 참여한 모임 정보 불러오기에 성공했습니다.'
      })
    }


  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

module.exports = { getAllMoim, getMoimByLocation, detailMoim, createMoim, updateMoim, deleteMoim, enterMoim, exitMoim, myMoims };