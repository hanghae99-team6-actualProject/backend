const { Moim, MoimUser, Comment, Like } = require('../models');
const myError = require('./utils/httpErrors');

const makeMoimUser = async (userId, moimId, userType, next) => { //모임의 유저를 만드는 함수
  
  await MoimUser.createOne({
    userId,
    moimId,
    host: userType,
  })
    .then(() => {
      if ( userType === 1 ) {
        console.log('host 유저생성 완료');
      } else if( userType === 0 ) {
        console.log('nomal 유저생성 완료');
      }
    })
    .catch((err) => {
      if (err) next(new Error('유저 생성 중 db 에러 발생'));
    });
};

const getAllMoim = async (req, res, next) => {
  try {
    console.log('getAllMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const allMoims = await Moim.findAll({
      include: [
        {
          model: MoimUser,
        },
        {
          model: Comment,
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
    return next(myError(400, err.message));
  }
};

const createMoim = async (req, res, next) => {
  try {
    console.log('createMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const { userId } = res.locals.user;
    const { title, contents } = req.body;
    console.log(userId);
    console.log(title);
    console.log(contents);

    // 1. 모임 db데이터 생성
    await Moim.createOne({
      title,
      contents,
    })
      .then((result) => {
        console.log(result);
        console.log(result.id);
        // 2. 생성된 모임의 호스트 데이터 생성
        await makeMoimUser(userId, result.id, 1);
        res.status(200).send({ result: true, msg: '모임과 호스트가 생성되었습니다.' });
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

const updateMoim = async (req, res, next) => {
  try {
    console.log('updateMoim router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const { userId } = res.locals.user;
    const { moimId } = req.params;
    const { title, contents } = req.body;

    //1. find?
    const targetMoim = Moim.findAll({
      where: { id: moimId },
    }).catch((err) => {
      console.log('update의 targetMoim find 중 db 에러');
      if (err) next(new Error('update의 targetMoim find 중 db 에러'));
    });

    console.log('target 모임', targetMoim);
    console.log('target 모임의 lengh', targetMoim.length);

    if (targetMoim.length > 0) {
      //2. update 실행
      await Moim.update(
        {
          title: title,
          contents: contents,
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

    const { userId } = res.locals.user;
    const { moimId } = req.params;

    const targetMoim = await Moim.findAll({
      where: { id: moimId },
    }).catch((err) => {
      if (err) next(new Error('delete의 targetMoim find 중 db 에러'));
    });

    if (targetMoim.length > 0) {
      await Moim.destroy({
        where: { id: moimId },
      })
        .then(() => {
          console.log('모임 삭제에 성공했습니다.');
          return res.stauts(200).send({
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

    const { moimId, userId } = req.params;

    await makeMoimUser(userId, moimId, 0); //host가 아닌 참가자 생성

    return res.status(200).send({
      result: true,
      msg: '모임 참가자 생성에 성공했습니다.'
    });

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
};

module.exports = { getAllMoim, createMoim, updateMoim, deleteMoim, enterMoim };
