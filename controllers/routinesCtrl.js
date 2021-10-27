const { Routine, Action, User } = require("../models");

//--Action 생성 함수--
async function actionCreate(routineId, userId, actions) {
  for await (let action of actions) {
    const { actionName, actionCnt } = action;
    await Action.create({
      routineId,
      userId,
      actionName,
      actionCnt
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
  try{
    await actionDelete(routineId);
    await actionCreate(routineId, userId, actions);
  }catch(err){
    console.log(err);
  }
  console.log('action 수정 완료')
}

//루틴 조회 API
const routineGet = async (req, res) => {

  console.log("routineGet router 진입");
  // const {userId} = req.locals.user;
  const userId = 1

  try {
    const routines = await Routine.findAll({
      where: { userId },
      include: [
        {
          model: Action,
        }
      ]
    });
    res.status(200).send({ result: routines, msg: "조회완료" });

  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false, msg: "조회 catch 에러 발생" });
  }
};

//루틴 생성 API
const routineCreate = async (req, res) => {

  console.log("routineCreate router 진입");

  // const {userId} = req.locals.user;
  const userId = 1
  console.log(userId);

  const {
    routineName,
    actions,
    isMain,
  } = req.body;

  //유저 DB체크
  try {
    const userExsist = await User.findAll({
      where: { id: userId },
    });

    if (userExsist.length == 0) {
      //res.status(400).send({ result: false, msg: '루틴 생성 대상 유저가 없습니다.' });
      throw new Error('루틴 생성 대상 유저가 없습니다.');
    }

    //루틴 DB체크
    const routines = await Routine.findAll({
      where: { userId, routineName },
    });

    if (routines.length == 0) {
      const routines = await Routine.create({
        userId,
        routineName,
        isMain,
      });
      const { id } = routines;
      actionCreate(id, userId, actions);
      res.status(200).send({ result: true, msg: '루틴이 생성되었습니다.' });
    } else {
      throw new Error('이미 동일한 이름으로 등록된 루틴이 있습니다.');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false, msg: err.message });
  }
};

//루틴 수정 API
const routineModify = async (req, res) => {
  console.log("routineModify router 진입");

  // const {userId} = req.locals.user;
  const userId = 1
  const { routineId } = req.params;
  const {
    routineName,
    actions,
    isMain,
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
          isMain,
        },
        {
          where: {
            id: routineId,
          },
        }
      );
      actionModify(routineId, userId, actions);
      res.status(200).send({ msg: '루틴이 수정되었습니다.' });
    } else {
      throw new Error('수정 대상 루틴이 없습니다..');
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({ result: false, msg: err.message });
  }
};

//루틴 삭제 API
const routineDelete = async (req, res) => {
  console.log("routineDelete router 진입");
  try {
    const { routineId } = req.params;
    await Action.destroy({
      where: { routineId }
    });
    console.log('routine종속 action 삭제완료')

    await Routine.destroy({
      where: { id: routineId }
    });
    res.status(200).send({ result: true, msg: '루틴이 삭제되었습니다.' });
  } catch (err) {
    console.log(err);
    throw new Error('루틴 삭제에 실패하였습니다.');
  }
  res.status(400).send({ result: false, msg: err.message });
};

module.exports = {
  routineGet,
  routineCreate,
  routineModify,
  routineDelete
};
