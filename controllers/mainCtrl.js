const { Routine, Action, User, Character, Sequelize} = require("../models");
const Op = Sequelize.Op;

//메인 루틴, 액션, 유저 조회
const ongoingGet = async(req, res) => {
  console.log("routineGet router 진입");
  //const {id} = res.locals.user; //미들웨어 locals 지정 변수 체크 후 수정
  const id = 1;
  try {
    const users = await User.findAll({
      where: { id },
      attributes : {
      },
      include: [{
        model: Character,
      },{
        model: Routine,
        where: {isMain : 1},
        include:[{
          model:Action
        }]
      }]
    });
    res.status(200).send({ result: users , msg: "진행중 루틴 및 액션 조회완료" });

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
    res.status(200).send({ finRoutines, finActions, msg: "히스토리 루틴 및 액션 조회완료" });

  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "히스토리 정보 조회 에러 발생" });
  }
};

module.exports = {
  ongoingGet,
  historyGet
};
