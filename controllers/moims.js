const { Moim, MoimUser, Comment, Like, User } = require('../models');
const myError = require('./utils/httpErrors');

const makeMoimUser = async (userId, moimId, userType, next) => {
  //모임의 유저를 만드는 함수
  try {
    console.log('함수에 들어옴!');
    console.log(userId);
    console.log(moimId);
    console.log(userType);

    await MoimUser.create({
      userId,
      moimId,
      host: userType,
    });
    console.log('========================생성완료================================');
    if (userType === 1) {
      console.log('host 유저생성 완료');
    } else if (userType === 0) {
      console.log('nomal 유저생성 완료');
    }
  } catch (err) {
    console.log(err);
    return next(myError(400, '유저 생성 중 db 에러 발생'));
  }
};

const getAllMoim = async (req, res, next) => {
  try {
    console.log('getAllMoim router 진입');
    // if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));
    // 로그인 없이 둘러볼 수 있는 페이지화

    const allMoims = await Moim.findAll({
      include: [
        {
          model: MoimUser,
          include: [
            {
              model: User,
              attributes: [ 'nickName' ],
            }
          ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: [ 'nickName' ],
            }
          ]
        },
        {
          model: Like,
        },
      ],
    }) // 이 코드는 좋아요를 누른 유저를 모두 보여줌. 필요에 따라 갯수만 나오게 변경 가능. >> 아래에 주석처리
      .catch((err) => {
        if (err) next(new Error('전체 모임정보 불러오기 중 db 에러'));
      });

    // 댓글, 좋아요 전체 정보
    // const allComments = await Comment.findAll({})
    // const allLikes = await Like.findAll({})

    // 각 모임의 좋아요의 수
    // const amountLikes = [];
    // for(let i=0; i<allLikes.length; i++){
    //   let targetLikes = await Like.findAndCountAll({
    //     where: { moinId : i },
    //   })
    //   console.log(targetLikes);
    //   targetLikes.push(amountLikes);
    // };
    // console.log(amountLikes);

    console.log('전체 모임정보 불러오기 성공');
    return res.send({
      result: true,
      allMoims,
      msg: '전체 모임정보 불러오기에 성공했습니다.',
    });
  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(500, err.message));
  }
};

const createMoim = async (req, res, next) => {
  try {
    console.log('createMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { title, contents, imgSrc } = req.body;
    console.log(userId);
    console.log(title);
    console.log(contents);
    console.log(imgSrc);

    // 생성 중복검사
    const isMoim = await Moim.findAll({
      where: {
        title: title,
        contents: contents,
      }
    })
      .catch((err) => {
        console.log("에러에러")
        if (err) next(new Error('모임 중복 생성 검사 중 db 에러'))
      });
    console.log('0이면 모임생성가능', isMoim.length)
    if (isMoim.length > 0) {
      return next(new Error('동일한 모임이 있습니다.'));
    }

    // 1. 모임 db데이터 생성
    await Moim.create({
      title,
      contents,
      imgSrc,
    })
      .then(async (result) => {
        console.log(result);
        console.log(result.id);
        // 2. 생성된 모임의 호스트 데이터 생성
        await makeMoimUser(userId, result.id, 1);
        return res.status(200)
                  .send({ result: true, msg: '모임과 호스트가 생성되었습니다.' });
      })
      .catch((err) => {
        console.log('create 중 db 에러');
        if (err) next(new Error('create 중 db 에러'));
      });
  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
};

const detailMoim = async (req, res, next) => {
  try {
    console.log('detailMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;

    const targetMoim = await Moim.findOne({
      where: { id: moimId },
      include: [
        {
        model: MoimUser,
        include: [
          {
            model: User,
            attributes: [ 'nickName' ],
          },
        ]
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: [ 'nickName' ],
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

    console.log('디테일이 필요한 모임 정보', targetMoim)
    if (targetMoim === null) {
      return next(new Error('모임 정보가 존재하지 않습니다. 먼저 모임 등록을 하시기바랍니다.'))
    }

    console.log('타겟 모임 조회 완료')
    return res.status(200).send({
      result: true,
      targetMoim,
      msg: '특정 모임의 정보 불러오기에 성공했습니다.'
    })

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

const updateMoim = async (req, res, next) => {
  try {
    console.log('updateMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;
    const { title, contents, imgSrc } = req.body;
    console.log(moimId);

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
      console.log('update의 targetMoim find 중 db 에러');
      if (err) next(new Error('update의 targetMoim find 중 db 에러'));
    });

    console.log('target 모임', targetMoim);
    console.log('target 모임의 lengh', targetMoim.length);
    
    
    console.log('target 모임의 host userId', targetMoim[0].MoimUsers[0].userId);
    // ㄴ 모임에 속한 유저를 나열했을 때 따로 필터링을 하지 않고서는 가장 처음 데이터가 호스트의 데이터이다
    // 왜냐하면, 모임을 생성할때 같이 생성되기 때문
    // 필요시 필터를 적용하여 검색하는 방식으로 진행
    if( targetMoim[0].MoimUsers[0].userId !== userId ) {
      return next(new Error('모임의 작성자만 수정이 가능합니다.'))
    }

    if (targetMoim.length > 0) {
      //2. update 실행
      await Moim.update(
        {
          title: title,
          contents: contents,
          imgSrc: imgSrc,
        },
        {
          where: { id: moimId },
        }
      )
        .then((result) => {
          console.log(result);
          console.log('데이터 update 성공');
          return res.status(200).send({
            result: true,
            msg: '모임 정보 수정에 성공했습니다.',
          });
        })
        .catch((err) => {
          console.log('updateMiom db 에러');
          if (err) next(new Error('updateMiom db 에러'));
        });
    } else {
      console.log('수정할 모임이 없습니다.');
      next(new Error('수정할 모임이 없습니다.')); //이렇게 쓰는 것이 맞는가?!
    }
  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
};

const deleteMoim = async (req, res, next) => {
  try {
    console.log('deleteMoim router 진입');
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

    
    console.log('target 모임의 host userId', targetMoim[0].MoimUsers[0].userId);
    // ㄴ 모임에 속한 유저를 나열했을 때 따로 필터링을 하지 않고서는 가장 처음 데이터가 호스트의 데이터이다
    // 왜냐하면, 모임을 생성할때 같이 생성되기 때문
    // 필요시 필터를 적용하여 검색하는 방식으로 진행
        if( targetMoim[0].MoimUsers[0].userId !== userId ) {
      return next(new Error('모임의 작성자만 삭제가 가능합니다.'))
    }

    if (targetMoim.length > 0) {
      await Moim.destroy({
        where: { id: moimId },
      })
        .then(() => {
          console.log('모임 삭제에 성공했습니다.');
          return res.status(200).send({
            result: true,
            msg: '모임 삭제에 성공했습니다.',
          });
        })
        .catch((err) => {
          if (err) next(new Error('모임 삭제 db 실행 에러 발생'));
        });
    } else {
      console.log('삭제할 대상이 존재하지 않습니다.');
      next(new Error('삭제할 대상이 존재하지 않습니다.'));
    }
  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
};

const enterMoim = async (req, res, next) => {
  try {
    console.log('enterMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;
    console.log(userId);
    console.log(moimId);

    const isUser = await MoimUser.findAll({
      where: {
        userId: userId,
        moimId,
      }
    }).catch((err) => {
      if (err) next(new Error('모임 참가 유저 중복검색 중 db 에러'))
    });
    console.log('0이면 유저생성가능', isUser.length)
    if (isUser.length > 0) {
      return next(new Error('이미 참가중인 모임입니다.'));
    }

    await makeMoimUser(userId, moimId, 0); //host가 아닌 참가자 생성

    return res.status(200).send({
      result: true,
      msg: '모임 참가자 생성에 성공했습니다.',
    });
  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
};

const exitMoim = async (req, res, next) => {
  try {
    console.log('enterMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;
    console.log(userId);
    console.log(moimId);

    const isEnterMoim = await MoimUser.findOne({
      where : { userId: userId, moimId },
      include: [
        {
          model: User,
          attributes: ['nickName']
        },
      ]
    }).catch((err) => { if (err) next(new Error('모임 참가 유저 검색 중 db 에러')) });

    // console.log('참여 여부 확인', isEnterMoim);
    // console.log('참여 여부 확인', isEnterMoim.User.nickName);
    
    const exitUserNickName = isEnterMoim.User.nickName;

    if (isEnterMoim.length === null) {
      return next(new Error('이미 비참가중인 모임입니다.'));
    }

    const exitMoim = await MoimUser.destroy({
      where: {userId: userId, moimId}
    }).catch((err) => { if (err) next(new Error('모임 참가 취소 중 db 에러')) });

    console.log(exitMoim); //삭제된 것이 있다면 1

    if( exitMoim !== 1) {
      return next(new Error('모임 참가 취소 중 원인을 알 수 없는 에러 발생. 관리자에게 문의 바랍니다.'));
    }

    return res.send({
      result: true,
      msg: '참가 취소 성공',
      exitUserNickName
    })

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

module.exports = { getAllMoim, detailMoim, createMoim, updateMoim, deleteMoim, enterMoim, exitMoim };