exports.doneAction = async (req, res, next) => {
  try {
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
    console.log(userId, 'adfsavbfreab');
    console.log(actionId, 'adfsavbfreab');
    await Action.findOne({ where: { userId: userId, id: actionId } })
      .then((result) => {
        console.log('확인완료');
        if (result === null) {
          throw new Error('잘못된 액션 정보입니다. 관리자에게 문의하세요');
        }
      })
      .catch((err) => {
        console.log(err);
        if (err) throw new Error('findOne 실패에러1. 관리자에게 문의하세요.');
      });

    // 3-2. 일치한다면 해당 액션을 DB에서 완료상태로 변경 >> finDate 현재시간으로 넣어주기
    let finDate = new Date();

    await Action.update({ finDate: finDate }, { where: { id: actionId } })
      .then(() => {
        console.log('액션 업데이트 성공');
      })
      .catch((err) => {
        if (err)
          throw new Error(
            'Action Update 함수 에러 발생. 관리자에게 문의하세요.'
          );
      });

    await Character.update(
      { exp: actionExpGrowth },
      { where: { characterName: targetCharacterName } }
    )
      .then(() => {
        res.status(200).send({
          result: true,
          msg: 'Action 완료에 따른 액션 완료 표시, 경험치 지급 처리 완료',
        });
      })
      .catch((err) => {
        if (err)
          throw new Error(
            'Character Update 함수 에러 발생. 관리자에게 문의하세요.'
          );
      });

    // 연쇄 추가작업: 마지막 액션이 완료되면 루틴이 완료된 것으로 처리한다.
    const isFinDate = await Action.findOne({
      where: { userId, routineId: routineId },
      attributes: ['actionNum', 'finDate'],
      order: [['actionNum', 'DESC']],
      limit: 1,
    });
    console.log(isFinDate);
    console.log(isFinDate.finDate);
    if (isFinDate.finDate === null) {
      return res.status(400).send({
        result: false,
        msg: '아직 루틴이 완료되지 않았습니다. 해당 루틴의 다른 액션도 실행해 주세요.',
      });
    }

    // .then((result) => {
    //   console.log(result, "요걸 봐야한다")
    //   console.log(result.actionNum, "액션중 가장높은 수")
    //   console.log(result.finDate, "가장높은 수의 핀데이트 정보")

    //   if(result.finDate === null) {
    //     console.log('루틴 미완료') //여기서 오류로 던진다?
    //     return res.status(400).send({
    //       result:true,
    //       msg :
    //     });
    //   }
    // })
    // .catch((err) => {
    //   if (err) throw new Error("루틴완료 관련 findOne 함수 에러 발생. 관리자에게 문의하세요.");
    // })

    // 마지막액션이 완료되면 루틴도 완료되면서 루틴의 finDate와 경험치를 부여
    await Routine.update({ finDate: finDate }, { where: { id: routineId } })
      .then(() => {
        console.log('루틴완료 finDate 업데이트 완료');
      })
      .catch((err) => {
        if (err)
          throw new Error(
            '루틴완료 관련 루틴 update 함수 에러 발생. 관리자에게 문의하세요.'
          );
      });

    await Character.update(
      { exp: routineExpGrowth },
      { where: { userId: userId, characterName: targetCharacterName } }
    )
      .then(() => {
        console.log('루틴완료 캐릭터exp 업데이트 완료');
      })
      .catch((err) => {
        if (err)
          throw new Error(
            '루틴완료 관련 캐릭터 update 함수 에러 발생. 관리자에게 문의하세요.'
          );
      });
    //조건 경험치가 꽉차면 expMax도 1로 변환해야한다.
  } catch (err) {
    return res.status(400).send({
      result: false,
      msg: err.message,
    });
  }
};