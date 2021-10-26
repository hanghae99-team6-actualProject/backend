const { Routine, Action, User} = require("../models");

//--Action 생성 함수--
async function actionCreate (routineId, userId, actions) {
  for await (let action of actions) {
    const {actionName, actionCnt} = action;
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
async function actionDelete (routineId) {
  await Action.destroy({
    where: { routineId }
  });
  console.log('action 삭제 완료')
}

//--Action 수정 함수--
//해당 루틴 아이디 기준 다 지우고 만든다. 왜?
//루틴 내 액션들이 로우별로 아이디 값 고유하게 갖고 있는 상태임
//이 때 루틴 아이디만으로 아이디 특정해서 바꾼다고 한들, 액션갯수가 계속 달라질 수 있으므로. 지우고 만드는게 효율적일듯
async function actionModify (routineId, actions) {
  console.log('수정 진입@@@@@@')
  await actionDelete(routineId);
  await actionCreate(routineId, actions);
  console.log('action 수정 완료')
  // for await (let action of actions) {
  //   const {actionName, actionCnt} = action;
  //   console.log(actionName,actionCnt)
  //   await Action.update(
  //     {
  //       actionName,
  //       actionCnt,
  //     },
  //     {
  //       where: {
  //         routineId: routineId,
  //       },
  //     }
  //   );
  // }
}

//루틴 조회 API
const routineGet = async(req, res) => {

  console.log("routineGet router 진입");
  const {userId} = req.params;

  try {
    const routines = await Routine.findAll({
      where: { userId },
      attributes : {
        // include: [ select추가할 때, 예를 들면 카운트 그룹바이 같이 하는 경우 등.
        //   [],
        // ]
      },
      include: [
        {
          model: Action,
        }
      ]
    });
    res.status(200).send({ result: routines , msg: "조회완료" });

  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "조회 catch 에러 발생" });
  }
};

//루틴 생성 API
const routineCreate = async(req, res) => {
  
  console.log("routineCreate router 진입");

  const {userId} = req.params;
  console.log(userId);
  const {
    routineName,
    actions,
    isMain,
  } = req.body;

  try {
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

      res.status(200).send({ msg: '루틴이 생성되었습니다.' });
    } else{
      res.send({ msg: '이미 동일한 이름으로 등록된 루틴이 있습니다.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: '루틴 생성 catch 에러 발생.' });
  }

};

//루틴 수정 API
const routineModify = async(req, res) => {
  
  console.log("routineModify router 진입");

  const {routineId} = req.params;
  console.log(routineId);
  const {
    routineName,
    actions,
    isMain,
  } = req.body;

  try {
    const routines = await Routine.findAll({
      where: { id: routineId },
    });

    if (routines.length == 1) {
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

      console.log("수정 아이디 체크");
      console.log(routineId);
      actionModify(routineId, actions);

      res.status(200).send({ msg: '루틴이 수정되었습니다.' });
    } else{
      res.send({ msg: '수정 대상 루틴이 없습니다.' });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({ msg: '루틴 수정 catch 에러 발생.' });
  }
};

//루틴 삭제 API
const routineDelete = async(req, res) => {
  console.log("routineDelete router 진입");
  try{
    const {routineId} = req.params;
    await Action.destroy({
      where: { routineId }
    });
    console.log('routine종속 action 삭제완료')

    await Routine.destroy({
      where: { id : routineId }
    });
    res.send({ msg: '루틴이 삭제되었습니다.' });
  }catch(error){
    console.log(error);
    res.send({ msg: '루틴 삭제에 실패하였습니다.' });
  }
  
};

module.exports = {
  routineGet,
  routineCreate,
  routineModify,
  routineDelete
};
