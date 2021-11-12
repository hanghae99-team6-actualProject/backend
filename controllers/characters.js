const { Character } = require('../models');
const crtConst = require('../constants/characters')
const myError = require('./utils/httpErrors')

const createCharacter = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const userId = res.locals.user.id;

    // 현재 유저가 만랩 캐릭터가 있는 것인지 확인
    const crtMax = await Character.findAll({
      where: { userId, expMax: 1 },
      attributes: ['characterName'],
      raw: true,
    });

    // 현재 유저가 키우고 있는 캐릭터가 있는지 확인
    const nowCrt = await Character.findAll({
      where: { userId: userId, expMax: 0 },
    });

    const isCrtMax = crtMax.length !== 0;
    const isNowCrt = nowCrt.length !== 0;

    // 만랩X, 현재 성장중인 캐릭터가 있는 경우
    if (isNowCrt) {
      throw new Error('현재 성장중인 캐릭터가 있습니다.');
    }
    else {
      let newCrtName;
      let newCrtIndex;

      // 아무런 캐릭터가 없는 경우
      // 프리셋 캐릭터 풀에서 난수로 지급
      if (!isCrtMax) {
        console.log("여긴 캐릭터가 하나도 없는 경우!");
        newCrtName = crtConst.preSetList[Math.floor(Math.random() * crtConst.preSetList.length)];
        // 캐릭터 뽑기 중 인덱스 번호 주기
        if(newCrtName === '무지'){
          newCrtIndex = crtConst.preSetList.indexOf(newCrtName, 1) + 2;
        } else {
          newCrtIndex = crtConst.preSetList.indexOf(newCrtName, 1) + 1;
        }
      }
      else {
        // 만랩달성 + 현재 키우는 캐릭터 없음
        // 과거 만랩 캐릭터를 리스트 형식으로 만들기
        const collcetionMaxCrt = crtMax.map((val) => val.characterName);

        //만랩컬랙션과 프리셋을 비교하여 없는 부분 추출
        let notCollection = crtConst.preSetList.filter(
          (x) => !collcetionMaxCrt.includes(x)
        );

        //안해본 캐릭터의 풀(notCollection)을 랜덤화하여 한개의 값 추출
        newCrtName = notCollection[Math.floor(Math.random() * notCollection.length)];

        // 캐릭터 뽑기 중 인덱스 번호 주기
        if(newCrtName === '무지'){
          newCrtIndex = crtConst.preSetList.indexOf(newCrtName, 1) + 2;
        } else {
          newCrtIndex = crtConst.preSetList.indexOf(newCrtName, 1) + 1;
        }
      }
      
      console.log(newCrtName, '랜덤화 한 새로운 캐릭터의 이름값!');
      console.log(newCrtIndex, '랜덤화 한 새로운 캐릭터의 인덱스값!');
      
      await Character.create({
        userId: Number(userId),
        preSet: 1,
        characterName: newCrtName,
        exp: 0,
        expMax: 0,
      })
        .then((r) => {
          return res.status(200).send({
            result: true,
            characterName: r.characterName,
            characterIndex: newCrtIndex,
            msg: '신규 캐릭터가 생성되었습니다.',
          });
        }).catch((err) => {
          if (err) return next(new Error('db생성 문제 발생'));
        });

    }
  } catch (error) {
    console.log(error);
    //'캐릭터 만들기에 실패했습니다. 관리자에게 문의하세요.',
    return next(myError(400, error.message));
  }
}

const getCharacter = async (req, res, next) => {
  try {
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'))
    const userId = res.locals.user.id;

    console.log(userId, "유저아이디!");
    // 현재 유저의 캐릭터 (만랩이 아님)
    const userCharacter = await Character.findAll({
      where: { userId, expMax: 0 },
      raw: true,
    });
    return res.send({ result: true, character: userCharacter, msg: "유저의 현재 캐릭터 확인" })
  }
  catch (err) {
    return next(err);
  }
}

module.exports = { createCharacter, getCharacter }