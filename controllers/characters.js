const { Character } = require('../models');
const crtConst = require('../constants/characters')

exports.newCharacter = async (req, res) => {
  try {
    // const userId = req.params.userId; // -> res.locals.user
    const userId = res.locals.user.id;

    console.log(userId, "유저아이디!");
    // 현재 유저가 만랩 캐릭터가 있는 것인지 확인
    const crtMax = await Character.findAll({
      where: { userId, expMax: 1 },
      attributes: ['characterName'],
      raw: true,
    });
    console.log(crtMax, "여긴 crtMax!!");
    console.log(crtMax.length === 0); // -> 오류가 아닌게 신기한데 chkCrt.length === 0이 가독성과 오류에서 좋아보입니다.
    // console.log(chkCrt[0].characterName, "여긴 chkCrt의 이름 변수타입!!!");
    // console.log(chkCrt[0].dataValues, "여긴 chkCrt의 이름 객체타입!!!");

    // 현재 유저가 키우고 있는 캐릭터가 있는지 확인
    const nowCrt = await Character.findAll({
      where: { userId: userId, expMax: 0 },
    });
    console.log(nowCrt, "여긴 nowCrt!!");
    console.log(nowCrt.length === 0); // find에서 아무것도 발견되지 않으면 언디파인드로 송출// -> isCrt === true/false로 하는게 나아보임
    // console.log(isCrt[0].characterName, "여긴 isCrt의 이름!!!!")

    // const crtConst.preSetList = ['무지', '카카오', '네이버']; // 캐릭터 풀 같은 고정 상수는 const로 하기 + 다른 파일로 만들어두기 도 좋습니다.

    const isCrtMax = crtMax.length !== 0;
    const isNowCrt = nowCrt.length !== 0;

    if (isNowCrt) { //처음 if문에는 조금 극단적인 상황을 넣는 것이 좋습니다. + undefined는 !로 대체 가능
      // ㄴ 만랩X, 현재 성장중인 캐릭터가 있는 경우
      throw new Error('현재 성장중인 캐릭터가 있습니다.');
    }
    else {
      let newCrtName;

      if (!isCrtMax) {
        console.log("여긴 캐릭터가 하나도 없는 경우!");
        // ㄴ 아무런 캐릭터가 없는 경우
        // 프리셋 캐릭터 풀에서 난수로 지급
        newCrtName = crtConst.preSetList[Math.floor(Math.random() * crtConst.preSetList.length)];
        // -> let은 거의 안쓴다고 보면 됩니다.
      }
      else {
        // 만랩달성 + 현재 키우는 캐릭터 없음
        // 과거 만랩 캐릭터를 리스트 형식으로 만들기
        const collcetionMaxCrt = crtMax.map((val) => val.characterName);

        //만랩컬랙션과 프리셋을 비교하여 없는 부분 추출// -> ??없는 부분이 없으면 어떡하죠?
        let notCollection = crtConst.preSetList.filter(
          (x) => !collcetionMaxCrt.includes(x)
        );

        //안해본 캐릭터의 풀(notCollection)을 랜덤화하여 한개의 값 추출
        newCrtName = notCollection[Math.floor(Math.random() * notCollection.length)];// -> 이부분은 기획적으로 더 많이 얘기를 해보아야 할 것 같습니다
      }
      console.log(newCrtName, '랜덤화 한 새로운 캐릭터의 이름값!');
      await Character.create({ // create는 크리티컬한 문제이기 때문에 오류를 주는게 낫습니다.
        userId: Number(userId),
        preSet: 1,
        characterName: newCrtName,
        exp: 0,
        expMax: 0,
      }).catch((err) => {
        if (err) throw new Error('db생성 문제 발생')
      })

      return res.status(200).send({
        result: true,
        msg: '신규 캐릭터가 생성되었습니다.',
      });
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