const { Routine, Action } = require("../models");

//--Action 생성 함수--
async function actionCreate (routineId, actions) {
  for await (let action of actions) {
    const {actionName, actionCnt} = action;
    await Action.create({
      routineId,
      actionName,
      actionCnt
    });
  }
}

//--Action 수정 함수--
//해당 루틴 아이디 기준 다 지우고 만든다. 왜?
//루틴 내 액션들이 로우별로 아이디 값 고유하게 갖고 있는 상태임
//이 때 루틴 아이디만으로 아이디 특정해서 바꾼다고 한들, 액션갯수가 계속 달라질 수 있으므로. 지우고 만드는게 효율적일듯
async function actionModify (routineId, actions) {
  console.log('수정 진입@@@@@@')
  for await (let action of actions) {
    const {actionName, actionCnt} = action;
    console.log(actionName,actionCnt)
    await Action.update(
      {
        actionName,
        actionCnt,
      },
      {
        where: {
          routineId: routineId,
        },
      }
    );
  }
}



//루틴 조회 API
const routineGet = async(req, res) => {

  console.log("routineGet router 진입");
  const {userId} = req.params;

  try {
    const routines = await Routine.findAll({
      where: { userId },
    });
    res.status(200).send({ result: routines , msg: "조회완료" });

  } catch (err) {
    res.status(400).send({ msg: "조회 에러 발생" });
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
      console.log("새로운아이디시다아아아아ㅏㅇ");
      console.log(id);
      actionCreate(id, actions);

      res.status(200).send({ msg: '루틴이 생성되었습니다.' });
    } else{
      res.send({ msg: '이미 동일한 이름으로 등록된 루틴이 있습니다.' });
    }
  } catch (error) {
    console.log(error);
    console.log('생성 catch 오류');
    res.status(200).send({ msg: '루틴 생성 catch 오류.' });
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
    res.status(200).send({ msg: '루틴 수정 catch 오류.' });
  }
};

//루틴 삭제 API
const routineDelete = async(req, res) => {
  
  console.log("routineDelete router 진입");

  res.send({ msg: '루틴이 삭제되었습니다.' });
};

module.exports = {
  routineGet,
  routineCreate,
  routineModify,
  routineDelete
};
