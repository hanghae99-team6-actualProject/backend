const { User, Routine, Action, Character } = require('../models');

exports.doneAction = async (req, res) => {
  // 1. 프론트로부터 완료된 액션에 대한 정보 획득, 파라미터로 유저정보 획득
  const { userId } = req.params;
  //const userId = 1; //테스트용
  const actionId = req.body.actionId;
  // const actionId = 12; //테스트용
  const routineId = req.body.routineId;
  const targetCharacterName = req.body.characterName;
  const actionExpGrowth = 20; //임의 값
  const routineExpGrowth = 100; //임의 값
  console.log('여긴 오나?');

  // 2. 유저정보와 액션이 정말 일치하는 데이터인지 확인
  console.log(userId, '이것이 유저아이디!');
  console.log(actionId, '액션아이디는 이것!');
  try {
    const isAction = await Action.findOne({ where: { userId, id: actionId } });
    console.log(isAction);
    console.log('요놈 잡았다');
    // 3-1. 일치하지 않으면 오류메세지
    if (!isAction) {
      return res.status(400).send({
        result: false,
        msg: '잘못된 액션 정보입니다. 관리자에게 문의하세요',
      });
    }
  } catch (error) {
    console.log(error);
    console.log('FindOne 함수 에러');
    return res.status(400).send({
      result: false,
      msg: 'findOne 함수 실행 에러 발생',
    });
  }

  // 3-2. 일치한다면 해당 액션을 DB에서 완료상태로 변경 >> finDate 현재시간으로 넣어주기
  let finDate = new Date();
  try {
    await Action.update(
      { finDate: finDate },
      { where: { id: actionId } }
    );
    let currentExp = await Character.findOne({
      where: { userId, expMax: 0},
      attributes: ['exp']
    });
    await Character.update(
      { exp: currentExp + actionExpGrowth },
      { where: { characterName: targetCharacterName } }
    );
    console.log('액션의 완료 처리 완료');
    // if (doneAction || growCharacter) {
    //     return res.status(200).send({
    //     result: true,
    //     msg: 'Action 완료에 따른 액션 완료 표시, 경험치 지급 처리 완료',
    //   });
    // }
  } catch (error) {
    console.log(error);
    console.log('Update 함수 에러');
    return res.status(400).send({
      result: false,
      msg: 'Update 함수 실행 에러 발생',
    });
  }

  // 연쇄 추가작업: 마지막 액션이 완료되면 루틴이 완료된 것으로 처리한다.
  console.log('연쇄 추가 작업 시작(루틴 관련)');
  let doneLastAction = await Action.findOne({
    where: { userId, routineId: routineId },
    attributes: ['actionNum', 'finDate'],
    order: [['actionNum', 'DESC']],
    limit: 1,
  });
  console.log(doneLastAction);
  console.log(doneLastAction.finDate);

  let currentExp = await Character.findOne({
    where: { userId, expMax: 0},
    attributes: ['exp']
  });
  console.log(currentExp);
  console.log(currentExp.exp, "여기가 현재 exp");

  // 마지막액션이 완료되면 루틴도 완료되면서 루틴의 finDate와 경험치를 부여
  if (doneLastAction.finDate !== null) {
    await Routine.update({ finDate: finDate }, { where: { id: routineId } }); 
    await Character.update(
      { exp: currentExp.exp + routineExpGrowth }, //누적값을 더하는 것
      { where: { userId: userId, characterName: targetCharacterName } }
    );
    return res.status(200).send({
      result: "true2",
      msg: '루틴 완료에 따른 경험치 부여 완료',
    });
  } else {
    return res.status(200).send({
      result: "true1",
      msg: 'Action 완료에 따른 액션 완료 표시, 경험치 지급 처리 완료',
    });
  }
};