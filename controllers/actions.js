const { actionExpGrowth, routineExpGrowth, expLimitPerDay } = require('../constants/characters');
const { User, Routine, Action, Character, ExpDayLog } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require("moment");

//경험치 제한 작업 영역 - yjh

//upDayTotalExp 함수 내 활용될 변수들
const today = new Date();
const year = today.getFullYear(); // 년도
const month = today.getMonth(); // 월
const date = today.getDate();  // 날짜
const fromToday = new Date(year,month,date,0,0,0);

//액션 루틴 완료 시 지급 경험치를 추가해서 주는 로직
const dayLogChk = async (userId,res) => {
  //입력되는 finDate기준으로 디비에 있는지 체크 후 없으면 생성
  try {
    const dayLogExist = ExpDayLog.findOrCreate({
      where: {
        userId,
        date:{
          [Op.gte]: fromToday,
        }
      },
      defaults:{
        totalExp: 0,
        date: new Date()
      }
    });
    return dayLogExist;
  }catch(err){
    console.log(err);
    throw new Error('dayLogChk 함수 실행 에러 발생')
  }
}

const upDayActionExp = async (userId) => {

  await dayLogChk(userId);

  const totalExpChk = await ExpDayLog.findAll({
    where: {
      userId,
      totalExp: {
        [Op.lt]: `${expLimitPerDay}`
      }
    },
  });

  console.log('@@@@@@@@@@@@@@@@@@@@@@@')
  await console.log(totalExpChk)

  if (await totalExpChk.length == 0) {
    return false;
  } else {
    await ExpDayLog.update(
      {
        totalExp : Sequelize.literal(`totalExp + ${actionExpGrowth}`)
      },
      {
        where: {
          userId,
          date:{
            [Op.gte]: fromToday,
          }
        }
      }
    );
    return true;
  }
}

//FIX : 루틴 계산식 변경에 따라 함께 변경되어야함
const upDayRoutineExp = async (userId) => {
  if (dayLogChk(userId)[0].totalExp > 1000) {
    return false;
  } else {
    await ExpDayLog.update(
      {
        totalExp : Sequelize.literal(`totalExp + ${actionExpGrowth} + ${routineExpGrowth}`)
      },
      {
        where: {
          userId,
          date:{
            [Op.gte]: fromToday,
          }
        }
      }
    );
    return true;
  }
}


//findate와 현재일자 비교해서 당일 획득 전체 경험치 체크
// const todayGetExp = async (req,res) => {

//   console.log(fromToday + '///' + toToday);
//   //목표 : 아래 쿼리를 통해 완료된 액션과 루틴 정보 겟또
//   //1. 쿼리 상에서, 이미 db에 있는 데이터 중 toDateString 형태로 바로 변환되면 where에서 바로 체크
//   //2. 1번 불가하면 일단 전체 일자 findAll  한 다음 문자열처리한 후 for문으로 조건걸어서 카운트 * 경험치
//   try {
//     const todayDoneRoutine = await Routine.findAll({
//       where: {
//         userId,
//         finDate: {
//           [Op.gte]: fromToday,
//           [Op.lte]: toToday
//           // [Op.is]: moment().toDate()
//           // [Op.is]: "20201010"
//         }
//       },
//     });

//     res.status(200).send({ result: true, todayDoneRoutine, msg: "당일 히스토리 루틴 및 액션 조회완료" });

//   } catch (err) {
//     console.log(err);
//     res.status(400).send({ msg: "당일 히스토리 정보 조회 에러 발생" });
//   }
// }

//경험치 제한 작업 영역 끝 - yjh


//루틴 경험치 작업 영역 시작 - yjh


//루틴 경험치 작업 영역 끝 - yjh

// 루틴완료 x 액션완료 일때 경험치 획득 + actionExpGrowth
const upExpFinOneAction = async (userId) => {
  //당일 한계 경험치 체크함수
  if (upDayActionExp(userId)) {
    await Character.update(
      { exp: Sequelize.literal(`exp + ${actionExpGrowth}`) },// add도 없는 sequelize수준..
      { where: { userId, expMax: 0 } }
    ).catch((err) => {
      console.log(err);
      if (err) throw new Error('upExpFinOneAction 함수 실행 에러 발생')
    });
  }else{
    return res.status(200).send({
      result: "true1",
      msg: 'Action 완료 날짜 표시, 경험치 일일한도 초과로 지급 안함',
    });
  }
}

// 루틴완료 o 액션완료 일때 경험치 획득 + actionExpGrowth + routineExpGrowth
const upExpAllAction = async (userId) => {
  //당일 한계 경험치 체크함수
  if (upDayRoutineExp(userId)) {
    await Character.update(
      { exp: Sequelize.literal(`exp + ${actionExpGrowth} + ${routineExpGrowth}`) },// add도 없는 sequelize수준..
      { where: { userId, expMax: 0 } }
    ).catch((err) => {
      console.log(err);
      if (err) throw new Error('upExpAllAction 함수 실행 에러 발생')
    });
  }else{
    return res.status(200).send({
      result: "true2",
      msg: 'Action과 Routine 완료 날짜 표시, 경험치 일일한도 초과로 지급 안함',
    });
  }
}

//액션 완료시 액션에 finDate 업데이트
const setActionFinDate = async (actionId, finDate) => {
  await Action.update({ finDate }, { where: { id: actionId } })
    .catch((err) => {
      if (err) throw new Error('setActionFinDate 함수 실행 에러 발생')
    });
}

//루틴 완료시 루틴에 finDate 업데이트
const setRoutineFinDate = async (routineId, finDate) => {
  await Routine.update({ finDate }, { where: { id: routineId } })
    .catch((err) => {
      console.log(err);
      if (err) throw new Error('setRoutineFinDate 함수 실행 에러 발생')
    });
}

const doneAction = async (req, res) => {
  try {
    // 1. 프론트로부터 완료된 액션에 대한 정보 획득, 파라미터로 유저정보 획득
    // const { userId } = req.params;// -> res.locals.user
    const userId = res.locals.user.id;
    const { actionId, routineId } = req.body;
    console.log('여긴 오나?');

    // 2. 유저정보와 액션이 정말 일치하는 데이터인지 확인
    console.log(userId, '이것이 유저아이디!');
    console.log(actionId, '액션아이디는 이것!');

    let finDate = new Date();

    await Action.findOne({ where: { id: actionId } })
      //잘못된 액션이 입력된 경우 throw
      .then((action) => {
        if (action.finDate !== null && action.finDate) {
          throw new Error('이미 완료된 액션인데 왜 들어왔을까요?');
        }
      })
      //액션에 finDate추가
      .then(async () => {
        setActionFinDate(actionId, finDate)
      })
      .then(async () => {
        await Action.findAndCountAll({ where: { userId, routineId, finDate: null } })
          .then(async ({ count, rows }) => {
            console.log('완료되지 않은 액션의 개수', count);
            //finDate가 null인 액션의 개수가 0보다 크다 === 루틴에 완료되지 않은 액션이 있다.
            if (count > 0) {
              console.log('액션만 완료된 경우')
              //액션이 완료되었을때 경험치
              upExpFinOneAction(userId);

              return res.status(200).send({
                result: "true1",
                msg: 'Action 완료 날짜 표시, 경험치 지급 완료',
              });
            }
            else {
              console.log('액션과 루틴이 함께 완료된 경우');
              //액션과 루틴이 함께 완료되었을때 경험치
              upExpAllAction(userId);
              //루틴에는 finDate추가
              setRoutineFinDate(routineId, finDate);

              return res.status(200).send({
                result: "true2",
                msg: 'Action과 Routine 완료 날짜 표시, 경험치 지급 완료',
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).send({ result: false, msg: err.message });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).send({ result: false, msg: err.message });
      });
  } catch {
    (err) => {
      return res.status(400).send({ result: false, msg: err.message });
    }
  };

  // 3-1. 일치하지 않으면 오류메세지
  // -> 할 필요가 없는 구문입니다. 둘 중에 하나만 하셔도 됩니다. 게다가 findOne은 왠만하면 에러가 날 일도 없고 아무런 정보가 없을때는 []를 리턴하기 때문에 만약 값이 없을때를 찾고싶다면 length로 구분하셔야 합니다.

  // 3-2. 일치한다면 해당 액션을 DB에서 완료상태로 변경 >> finDate 현재시간으로 넣어주기

  // thisAction
  // await Action.update(// -> find와 달리 create, update는 오류가 발생할 확률이 높거나 크리티컬하기 때문에 오류를 넣어주는 것이 좋습니다.
  //   { finDate: finDate },
  //   { where: { id: actionId } }
  // ).then((action)=>{
  //   await Character.update( 
  //     { exp: actionExpGrowth },
  //     { where: { characterName } })
  // })
  // .catch((err) => {
  //   if (err) throw new Error('Action.update 함수 실행 에러 발생')
  // });

  // //액션이 완료되었을때 경험치
  // await Character.update(
  //   { exp: actionExpGrowth },// -> ??더해주어야 하는 것 아닌가요????
  //   { where: { characterName } }
  // ).catch((err) => {
  //   if (err) throw new Error('Action.update 함수 실행 에러 발생')
  // });
  // console.log('액션의 완료 처리 완료');


  // // -> 다른 함수로 쪼개도 좋을 것 같습니다. 그렇게 하면 api가 쪼개지거나 하는 기획 변경에 대처하기 용이합니다.
  // // 연쇄 추가작업: 마지막 액션이 완료되면 루틴이 완료된 것으로 처리한다.
  // console.log('연쇄 추가 작업 시작(루틴 관련)');
  // let doneLastAction = await Action.findOne({// -> 
  //   where: { userId, routineId: routineId },
  //   attributes: ['actionNum', 'finDate'],
  //   order: [['actionNum', 'DESC']],
  //   limit: 1,
  // });
  // console.log(doneLastAction);
  // console.log(doneLastAction.finDate);

  // let currentExp = await Character.findOne({// -> 아까 업데이트 하면서 이미 
  //   where: { userId, expMax: 0 },
  //   attributes: ['exp']
  // });
  // console.log(currentExp);
  // console.log(currentExp.exp, "여기가 현재 exp");

  // // 마지막액션이 완료되면 루틴도 완료되면서 루틴의 finDate와 경험치를 부여
  // if (doneLastAction.finDate !== null) {
  //   await Routine.update({ finDate: finDate }, { where: { id: routineId } });
  //   await Character.update(
  //     { exp: currentExp.exp + routineExpGrowth }, //누적값을 더하는 것
  //     { where: { userId: userId, characterName } }
  //   );
  //   return res.status(200).send({
  //     result: "true2",
  //     msg: '루틴 완료에 따른 경험치 부여 완료',
  //   });
  // } else {
  //   return res.status(200).send({
  //     result: "true1",
  //     msg: 'Action 완료에 따른 액션 완료 표시, 경험치 지급 처리 완료',
  //   });
  // }
};

module.exports = { doneAction };