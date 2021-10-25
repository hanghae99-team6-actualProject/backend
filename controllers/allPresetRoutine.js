const allPresetRoutine = async (req, res) => {
  try {
    const routines = await Routine.findAll();
    console.log(routines);
    console.log("전체 불러오기 완료!");

    return res.status(200).send({
      routines: routines,
      msg: '목록 불러오기 완료',
    });
  } catch (error) {
    console.log(error);

    return res.status(400).send({
      msg: '알 수 없는 오류 발생',
    });
  }
};

module.exports = allPresetRoutine;