const { User, Routine, Action, Character } = require('../models');

exports.doneAction = async (req, res) => {
  // 1. 프론트로부터 완료된 액션에 대한 정보 획득, 파라미터로 유저정보 획득
  // const { userId } = req.params;
  const userId = 1; //테스트용
  // const { actionId } = req.body;
  const actionId = 12; //테스트용
  console.log('여긴 오나?');

  // 2. 유저정보와 액션이 정말 일치하는 데이터인지 확인
  try {
    const isAction = await Action.findOne({ where: { userId, id: actionId } });
    console.log(isAction);
    console.log('요놈 잡았다');
    // 3-1. 일치하지 않으면 오류메세지
    if (!isAction) {
      throw Error('잘못된 액션 정보입니다. 관리자에게 문의하세요');
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
    await Action.update({ finDate: finDate }, { where: { id: actionId } });
    console.log('여기까지온거면 완성');
    return res.status(200).send({
      result: true,
      msg: 'Action 완료 처리 완료',
    });
  } catch (error) {
    console.log(error);
    console.log('Update 함수 에러');
    return res.status(400).send({
      result: false,
      msg: 'Update 함수 실행 에러 발생',
    });
  }
}