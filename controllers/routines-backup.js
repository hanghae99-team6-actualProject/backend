const { Routine, Action, User } = require("../models");
const myError = require('./utils/httpErrors')

//--Action 생성 함수--
async function actionCreate(routineId, userId, actions) {
  for await (const [index, value] of actions.entries()) {
    console.log(index, value);
    const { actionName, actionCnt, actionType } = value;
    await Action.create({
      routineId,
      userId,
      actionName,
      actionCnt,
      actionType,
      actionNum: index
    });
  }

  console.log('action 생성 완료')
}

//--Action 삭제 함수--
async function actionDelete(routineId) {
  await Action.destroy({
    where: { routineId }
  });
  console.log('action 삭제 완료')
}

//--Action 수정 함수--
//해당 루틴 아이디 기준 다 지우고 만든다. 왜?
//루틴 내 액션들이 로우별로 아이디 값 고유하게 갖고 있는 상태임
//이 때 루틴 아이디만으로 아이디 특정해서 바꾼다고 한들, 액션갯수가 계속 달라질 수 있으므로. 지우고 만드는게 효율적일듯
async function actionModify(routineId, userId, actions) {
  await actionDelete(routineId)
    .catch((err) => { if (err) next(new Error('actionDelete db 에러')) })
  await actionCreate(routineId, userId, actions)
    .catch((err) => { if (err) next(new Error('actionCreate db 에러')) })

  console.log('action 수정 완료')
}

//루틴 조회 API
const routineGet = async (req, res, next) => {
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
  console.log("routineGet router 진입");
  const { id } = res.locals.user;
  const authId = id

  try {
    const routines = await Routine.findAll({
      where: { userId: authId },
      include: [
        {
          model: Action,
        }
      ]
    });
    res.status(200).send({ result: true, routines, msg: "조회완료" });

  } catch (err) {
    console.log(err);
    return next(myError(400, "조회 catch 에러 발생"));
  }
};

//루틴 생성 API
const routineCreate = async (req, res, next) => {
  console.log("routineCreate router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  const { id } = res.locals.user;
  const authId = id
  const isMain = 0
  const {
    routineName,
    actions
  } = req.body;

  //유저 DB체크
  try {
    const userExsist = await User.findAll({
      where: { id: authId },
    });

    if (userExsist.length == 0) {
      throw new Error('루틴 생성 대상 유저가 없습니다.');
    }

    //루틴 DB체크
    const routines = await Routine.findAll({
      where: { userId: authId, routineName },
    });

    if (routines.length == 0) {
      const routines = await Routine.create({
        userId: authId,
        routineName,
        isMain,
      });
      const { id } = routines;
      actionCreate(id, authId, actions)
        .then(() => {
          res.status(200).send({ result: true, msg: '루틴이 생성되었습니다.' });
        })
        .catch((err) => { if (err) next(new Error('actionCreate db 에러')) })
    } else {
      throw new Error('이미 동일한 이름으로 등록된 루틴이 있습니다.');
    }
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

//루틴 수정 API
const routineModify = async (req, res, next) => {
  console.log("routineModify router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  const { id } = res.locals.user;
  const authId = id

  const { routineId } = req.params;
  const {
    routineName,
    actions,
  } = req.body;

  try {
    //루틴 DB체크
    const routineExsist = await Routine.findAll({
      where: { id: routineId },
    });

    if (routineExsist.length == 1) {
      await Routine.update(
        {
          routineName,
        },
        {
          where: {
            id: routineId,
          },
        }
      );
      await actionModify(routineId, authId, actions);
      return res.status(200).send({ result: true, msg: '루틴이 수정되었습니다.' });
    } else {
      throw new Error('수정 대상 루틴이 없습니다.');
    }
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  }
};

//루틴 삭제 API
const routineDelete = async (req, res, next) => {
  console.log("routineDelete router 진입");
  if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))

  // const { id } = res.locals.user;
  // const authId = id

  try {
    const { routineId } = req.params;
    await Action.destroy({
      where: { routineId }
    });
    console.log('routine종속 action 삭제완료')

    await Routine.destroy({
      where: { id: routineId }
    }).then(() => {
      res.status(200).send({ result: true, routineId, msg: '루틴이 삭제되었습니다.' });
    })
  } catch (err) {
    console.log(err);
    return next(myError(400, '루틴 삭제에 실패하였습니다.'));
  }
};

// 프리셋 루틴 불러오기 API
const allPresetRoutine = async (req, res, next) => {
  try {
    const routines = await Routine.findAll({
      where: { preSet: 1 },
      include: [
        {
          model: Action,
        },
      ],
    });
    console.log(routines);
    console.log("전체 불러오기 완료!");

    return res.status(200).send({
      result: true,
      routines: routines,
      msg: '목록 불러오기 완료',
    });
  } catch (error) {
    console.log(error);
    return next(myError(400, '알 수 없는 오류 발생',
    ));
  }
};


module.exports = {
  routineGet,
  routineCreate,
  routineModify,
  routineDelete,
  allPresetRoutine
};
