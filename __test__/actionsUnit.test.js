
jest.mock('../models/expdaylog');
const ExpDayLog = require('../models/expdaylog');
const {chkDayLog} = require('./user');

describe('chkDayLog', () => {
  const userId = testId001;
  const { fromToday } = timeSet();

  test('데이로그가 있는지 체크하고 있으면 해당 데이터를, 없으면 새로 생성한 후 해당 데이터를 리턴해야한다', async (userId) => {
    expect(chkDayLog(userId))
  })

  test("데이로그 함수는 ", async () => {
    await expect(chkDayLog()).resolves.toBe(30);
  });
}) 

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