require('dotenv').config();
const { User, Character, Moim, MoimUser, Comment, Routine, Action } = require('../models');
const myError = require('./utils/httpErrors')

//paranoid세팅으로 임시 삭제이기 때문에 node-cron에서 주기적으로 실제 삭제
const bye = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { id } = res.locals.user;
    User.destroy({ where: { id } })
      .then(() => {
        res.send({ result: true, msg: "회원 탈퇴가 완료되었습니다" })
      })
      .catch((err) => {
        if (err) return next(new Error('User db삭제 에러'))
      })
  } catch (err) {
    console.log(err);
    return next(err);
  }
}

const collection = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const { id } = res.locals.user;
    const usersCharacter = await Character.findAll({
      where: {
        userId: id,
        exp: 1000,
      },
    }).catch((err) => {
      console.log(err);
      if (err) return next(new Error('Character db 검색 에러'));
    })
    return res.send({ result: true, character: usersCharacter, msg: '성공' });
  } catch (err) {
    return next(err);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = res.locals.user;
    if (Object.keys(req.body).length === 0) {
      return next(new Error('수정할 정보가 없습니다.'));
    }
    const { userEmail, nickName, userPw } = req.body;

    User.update({ userEmail, nickName, userPw }, { where: { id } })
      .then(() => {
        return res.send({ result: true, msg: '유저 정보가 수정되었습니다' });
      })
      .catch((err) => {
        if (err) return next(new Error('유저 정보 수정 db 에러'));
      })
  } catch (err) {
    console.log(err);
    return next(err);
  }
}


//메인 루틴 조회 API
const getMainRoutine = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  console.log("getMainRoutine router 진입");
  const { id: userId } = res.locals.user;

  try {
    const mainRoutine = await Routine.findOne({
      where: { userId, isMain: 1 },
      include: [
        {
          model: Action,
        }
      ]
    });
    res.send({ result: true, mainRoutine, msg: "메인 루틴 조회완료" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "조회 catch 에러 발생"));
  }
};


//메인 루틴 설정 API
const setMainRoutine = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  console.log("setMainRoutine router 진입");
  const { id: userId } = res.locals.user;
  const { routineId } = req.body;

  try {
    await Routine.update({ isMain: 0 }, {
      where: { userId, isMain: 1 }
    })
    await Routine.update({ isMain: 1 }, {
      where: { id: routineId }
    });
    res.send({ result: true, msg: "메인 루틴으로 설정하였습니다" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "메인 루틴 설정 update 에러 발생"));
  }
};
const myMoim = async (req, res, next) => {
  try {
    console.log('myMoin 라우터 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

    const userId = res.locals.user.id;
    const userType = req.body.userType;
    const hostType = Number(userType)
    console.log(userType);
    console.log(hostType);

    const allMyMoim = await MoimUser.findAll({
      where: { userId: userId, host: hostType },
      include: [
        {
          model: Moim,
          include: [{
            model: MoimUser,
          }]
        },
      ]
    }).catch((err) => {
      if (err) next(new Error('나의 모임 리스트 조회 db 에러'));
    })

    if (hostType === 1) {
      console.log('호스트인 경우')
      console.log(allMyMoim.length);
      if (allMyMoim.length === 0) {
        console.log('개설한 모임이 없습니다.');
        return res.status(200).send({
          result: "true2",
          msg: '내가 만든 모임이 없습니다.'
        })
      }

      console.log('조회 완료')
      return res.status(200).send({
        result: "true1",
        allMyMoim,
        msg: '내가 만든 모임 정보 불러오기에 성공했습니다.'
      })
    } else if (hostType === 0) {
      console.log('참여자인 경우')
      console.log(allMyMoim.length);
      if (allMyMoim.length === 0) {
        console.log('참여한 모임이 없습니다.');
        return res.status(200).send({
          result: "true4",
          msg: '내가 참여한 모임이 없습니다.'
        })
      }

      // console.log('조회 완료')
      // console.log(allMyMoim[0].length)
      // console.log(allMyMoim[0]["Moim"].length)
      // console.log(allMyMoim[0]["Moim"]["MoimUsers"].length)
      // console.log(allMyMoim[0].Moim.MoimUsers.length)
      // console.log("==============================================================")
      // for(i=0; i<allMyMoim.length; i++){
      //   console.log(allMyMoim[i]["Moim"]["MoimUsers"].length);
      // }

      return res.status(200).send({
        result: "true3",
        allMyMoim,
        msg: '내가 참여한 모임 정보 불러오기에 성공했습니다.'
      })
    }


  } catch (err) {
    console.log(err);
    console.log('catch문 작동')
    return next(myError(400, err.message));
  }
}

const myComments = async (req, res, next) => {
  try {
    console.log('myMoin 라우터 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

    const userId = res.locals.user.id;

    const myCommentList = await Comment.findAll({
      where: { userId: userId },
      atrribute: ['id', 'userId', 'moimId', 'contents'],
    }).catch((err) => {
      if (err) next(new Error('나의 댓글 리스트 조회 db 에러'));
    });

    console.log('검색결과를 확인', myCommentList.length);
    if (myCommentList.length === 0) {
      return res.status(200).send({
        result: 'true2',
        msg: '내가 단 댓글이 없습니다. 댓글을 먼저 달아주세요.'
      })
    }

    console.log('댓글 조회 완료')
    return res.status(200).send({
      result: 'true1',
      myCommentList,
      msg: '나의 댓글 목록 정보 조회에 성공했습니다.'
    });

  } catch (err) {
    console.log(err);
    console.log('catch문 작동')
    return next(myError(400, err.message));
  }
}

module.exports = { bye, collection, updateUser, setMainRoutine, getMainRoutine, myMoim, myComments };