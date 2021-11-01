const { actionExpGrowth, routineExpGrowth } = require('../constants/characters');
const { User, Routine, Action, Character } = require('../models');
const Sequelize = require('sequelize');
const myError = require('./utils/httpErrors')


// 루틴완료 x 액션완료 일때 경험치 획득 + actionExpGrowth
const upExpFinOneAction = async (userId) => {
  await Character.update(
    { exp: Sequelize.literal(`exp + ${actionExpGrowth}`) },// add도 없는 sequelize수준..
    { where: { userId, expMax: 0 } }
  )
}

// 루틴완료 o 액션완료 일때 경험치 획득 + actionExpGrowth + routineExpGrowth
const upExpAllAction = async (userId) => {
  await Character.update(
    { exp: Sequelize.literal(`exp + ${actionExpGrowth} + ${routineExpGrowth}`) },// add도 없는 sequelize수준..
    { where: { userId, expMax: 0 } }
  )
}

//액션 완료시 액션에 finDate 업데이트
const setActionFinDate = async (actionId, finDate) => {
  await Action.update({ finDate }, { where: { id: actionId } })
}

//루틴 완료시 루틴에 finDate 업데이트
const setRoutineFinDate = async (routineId, finDate) => {
  await Routine.update({ finDate }, { where: { id: routineId } })
}

const doneAction = async (req, res, next) => {
  try {
    // 1. 프론트로부터 완료된 액션에 대한 정보 획득, 파라미터로 유저정보 획득
    // const { userId } = req.params;// -> res.locals.user
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const userId = res.locals.user.id;
    const { actionId, routineId } = req.body;

    console.log(userId, '이것이 유저아이디!');
    console.log(actionId, '액션아이디는 이것!');

    let finDate = new Date();
    // 2. 유저정보와 액션이 정말 일치하는 데이터인지 확인
    await Action.findOne({ where: { id: actionId } })
      //잘못된 액션이 입력된 경우 throw
      .then((action) => {
        if (action.finDate !== null && action.finDate) {
          return next(new Error('이미 완료된 액션인데 왜 들어왔을까요?'));
        }
      })
      //3. 액션에 finDate추가
      .then(async () => {
        await setActionFinDate(actionId, finDate)
              .catch((err) => {
                if (err) next(new Error('setActionFinDate db 에러'));
              });
      })
      .then(async () => {
        //4. finDate가 추가되지 않은 액션의 숫자를 검색
        await Action.findAndCountAll({ where: { userId, routineId, finDate: null } })
          .then(async ({ count, rows }) => {
            console.log('완료되지 않은 액션의 개수', count);
            //finDate가 null인 액션의 개수가 0보다 크다 === 루틴에 완료되지 않은 액션이 있다.
            if (count > 0) {
              console.log('액션만 완료된 경우')
              //5. 액션이 완료되었을때 경험치
              upExpFinOneAction(userId)
                .catch((err) => {
                  if (err) return next(new Error('upExpFinOneAction db 에러'));
                });

              return res.status(200).send({
                result: "true1",
                msg: 'Action 완료 날짜 표시, 경험치 지급 완료',
              });
            }
            else {
              console.log('액션과 루틴이 함께 완료된 경우');
              //5. 액션과 루틴이 함께 완료되었을때 경험치
              upExpAllAction(userId)
                .catch((err) => {
                  if (err) return next(new Error('upExpAllAction db 에러'));
                });
              //6. 루틴에는 finDate추가
              setRoutineFinDate(routineId, finDate)
                .catch((err) => {
                  if (err) return next(new Error('setRoutineFinDate db 에러'));
                });

              return res.status(200).send({
                result: "true2",
                msg: 'Action과 Routine 완료 날짜 표시, 경험치 지급 완료',
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return next(myError(400, err.message));
          });
      })
      .catch((err) => {
        console.log(err);
        return next(myError(400, err.message));
      });
  } catch (err) {
    console.log(err);
    return next(myError(400, err.message));
  };
};

module.exports = { doneAction };