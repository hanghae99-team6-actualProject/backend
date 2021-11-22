const fn = require('../controllers/actions');

jest.mock('../controllers/actions'); 

test("단일 액션 완료 시 당일 한계 경험치가 최대값보다 낮다면 업데이트하고 true를 리턴한다.", async () => {
  await expect(fn.upDayActionExp()).resolves.toBe(30);
});

test("단일 액션 완료 시 당일 한계 경험치가 최대값보다 높다면 false를 리턴한다.", async () => {
  await expect(fn.upDayActionExp()).resolves.toBe(30);
});

test("데이로그 있는지 찾고 없으면 생성한다.", async () => {
  await expect(fn.chkDayLog().mockReturnValue(Promise.resolve(true))).resolves.toBe(30);
});


fn.chkDayLog.mockReturnValue([]);

test("dd", async () => {
  console.log('@@@@@@@@@@@@@@@');
  console.log(mockFn3.mock.calls);
  console.log(mockFn3.mock.results);
  expect("dd").toBe("dd");
})

test('사용자를 못 찾으면 res.status(404).send(no user)를 호출 함', async () => {
  User.findOne.mockReturnValue(null);
  await addFollowing(req, res, next);
  expect(res.status).toBeCalledWith(404);
  expect(res.send).toBeCalledWith('no user');
});

// const chkDayLog = async (userId) => {
//   try {
//     const { fromToday } = timeSet();

//     const dayLogExist = ExpDayLog.findOrCreate({
//       where: {
//         userId,
//         date: {
//           [Op.gte]: fromToday,
//         },
//       },
//       defaults: {
//         totalExp: 0,
//         date: new Date(),
//       },
//     });
//     return dayLogExist;
//   } catch (err) {
//     logger.error(err);
//     throw new Error('chkDayLog 함수 실행 에러 발생');
//   }
// };