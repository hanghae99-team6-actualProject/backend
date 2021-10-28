const { User, Routine, Action, Character } = require('../models');

exports.allPresetRoutine = async (req, res) => {
  try {
    const routines = await Routine.findAll({
      where: { preSet:1 },
      attributes: {
        // include: [ select추가할 때, 예를 들면 카운트 그룹바이 같이 하는 경우 등.
        //   [],
        // ]
      },
      include: [
        {
          model: User,
        },
        {
          model: Action,
        },
      ],
    });
    console.log(routines);
    console.log("전체 불러오기 완료!");

    return res.status(200).send({
      result: true,
      routines: routines,
      msg: '목록 불러오기 완료',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      result: false,
      msg: '알 수 없는 오류 발생',
    });
  }
};