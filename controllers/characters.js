const { User, Routine, Action, Character } = require('../models');

exports.newCharacter = async (req, res) => {
  try {
    const userId = req.params.userId;
    // const userId = 1;
    console.log(userId, "유저아이디!");
    // 현재 유저가 만랩 캐릭터가 있는 것인지 확인
    const chkCrt = await Character.findAll({
      where: { userId: userId, expMax: 1 },
      attributes: ['characterName'],
      order: [['updatedAt', 'DESC']],
    });
    console.log(chkCrt, "여긴 chkCrt!!");
    console.log(chkCrt[0] === undefined); // find에서 아무것도 발견되지 않으면 언디파인드로 송출
    // console.log(chkCrt[0].characterName, "여긴 chkCrt의 이름 변수타입!!!");
    // console.log(chkCrt[0].dataValues, "여긴 chkCrt의 이름 객체타입!!!");

    // 현재 유저가 키우고 있는 캐릭터가 있는지 확인
    const isCrt = await Character.findAll({
      where: { userId: userId, expMax: 0 },
    });
    console.log(isCrt, "여긴 isCrt!!");
    console.log(isCrt[0] === undefined); // find에서 아무것도 발견되지 않으면 언디파인드로 송출
    // console.log(isCrt[0].characterName, "여긴 isCrt의 이름!!!!")

    let crtPreSetList = ['1', '2', '3'];

    if (chkCrt[0] === undefined && isCrt[0] !== undefined) {
      console.log(chkCrt[0] === undefined);
      console.log(isCrt[0] !== undefined);
      // ㄴ 만랩X, 현재 성장중인 캐릭터가 있는 경우
      throw new Error('현재 성장중인 캐릭터가 있습니다.');
    } else if (chkCrt[0] === undefined && isCrt[0] === undefined) {
      console.log("여긴 캐릭터가 하나도 없는 경우!");
      // ㄴ 아무런 캐릭터가 없는 경우
      // 프리셋 캐릭터 풀에서 난수로 지급
      let newCrtName =
        crtPreSetList[Math.floor(Math.random() * crtPreSetList.length)];

      console.log(newCrtName);
      console.log(Number(userId));

      await Character.create({
        userId: Number(userId),
        preSet: 1,
        characterName: newCrtName,
        exp: 0,
        expMax: 0,
      });
      return res.status(200).send({
        result: true,
        msg: '신규 캐릭터가 생성되었습니다.',
      });
    } else if (chkCrt[0] !== undefined && isCrt[0] === undefined) {
      // 만랩달성 + 현재 키우는 캐릭터 없음
      // 과거 만랩 캐릭터를 리스트 형식으로 만들기
      let collcetionMaxCrt = [];
      for (let i = 0; i < chkCrt.length; i++) {
        console.log(chkCrt[i]['characterName']);
        return collcetionMaxCrt.push(chkCrt[i]['characterName']);
      }
      console.log(collcetionMaxCrt);

      //만랩컬랙션과 프리셋을 비교하여 없는 부분 추출
      let notCollection = crtPreSetList.filter(
        (x) => !collcetionMaxCrt.includes(x)
      );
      console.log(notCollection);

      //안해본 캐릭터의 풀(notCollection)을 랜덤화하여 한개의 값 추출
      let newCrtName =
        notCollection[Math.floor(Math.random() * notCollection.length)];
      console.log(newCrtName, '랜덤화 한 새로운 캐릭터의 이름값!');

      //newCrtName를 이용하여 새로운 캐릭터 생성
      await Character.create({
        userId: Number(userId),
        preSet: 1,
        characterName: newCrtName,
        exp: 0,
        expMax: 0,
      });
      return res.status(200).send({
        result: true,
        msg: '신규 캐릭터가 생성되었습니다.',
      });
    } else if(chkCrt[0] !== undefined && isCrt[0] !== undefined) {
      //만랩 캐릭터와 성장중인 캐릭터 둘다 있는 경우
      throw new Error('현재 성장중인 캐릭터가 있습니다.');
    }
  } catch (error) {
    console.log(error);
    res.status(400).send({
      result: false,
      msg: error.message
      //'캐릭터 만들기에 실패했습니다. 관리자에게 문의하세요.',
    });
  }
}