const { Routine, Action, User, Sequelize} = require("../models");
const Op = Sequelize.Op;

const ongoingGet = async(req, res) => {

  console.log("routineGet router 진입");
  //const {id} = res.locals.user; //미들웨어 locals 지정 변수 체크 후 수정
  const userId = 1;
  try {
    const routines = await Routine.findAll({
      where: { userId, isMain : 1 },
      attributes : {
      },
      include: [{
        model: User,
      },{
        model: Action,
      }]
    });
    res.status(200).send({ result: routines , msg: "진행중 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "진행중 정보 조회 에러 발생" });
  }
};

const historyGet = async(req, res) => {

  console.log("routineGet router 진입");
  //const {id} = res.locals.user; //미들웨어 locals 지정 변수 체크 후 수정
  const userId = 1;
  try {
    const finRoutines = await Routine.findAll({
      where: {
        userId,
        findate : {
          [Op.not]: null
        }
      },
    });

    const finActions = await Action.findAll({
      where: { 
        userId,
        findate : {
          [Op.not]: null
        }
      },
    });

    // let finActions = []
    // for await (const routine of finRoutines) {
    //   const {id} = routine;
    //   const actions = await Action.findAll({
    //     where: { routineId: id },
    //   });
    //   finActions.push(actions);
    // }

    res.status(200).send({ result: finRoutines, finActions, msg: "히스토리 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "히스토리 정보 조회 에러 발생" });
  }
};


module.exports = {
  ongoingGet,
  historyGet
};
