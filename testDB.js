const models = require('./models');

// // Creat ------------------------------------------------------------------------

// // 가짜 데이터 만들기 - User_DB
// models.User.create({
//   userEmail: 'tset1@test.com',
//   nickName: 'test1',
//   userPw: '1111',
//   providerId: '1111a',
//   provider: '',
//   exp: 1,
//   delType: 0,
//   role: 'smt',
// }).then((result) => console.log('Data1 is Created!'));


// 가짜 데이터 만들기 - Routine_DB
const routineName = "PSR1";
const inMain = 0;
const preSet = 1;
const finDate = new Date();
//프리셋 데이터 만들기
// 유저가 없어도 됌
// 프리셋 : 1
models.Routine.create({
  routineName : routineName,
  inMain : inMain,
  preSet: preSet,
  finDate : finDate,
}).then((result) => console.log('Data is Created!'));

const finDate = new Date();
models.Routine.create({
  userId : 1,
  routineName : "R1",
  inMain : 0,
  preSet : 1,
  finDate : finDate,
}).then((result) => console.log('Data is Created!'));

const finDate = new Date();
models.Routine.create({
  userId : 1,
  routineName : "R2",
  inMain : 0,
  preSet : 1,
  finDate : finDate,
}).then((result) => console.log('Data is Created!'));


// // 가짜 데이터 만들기 - Action_DB
// const userId = 1;
// const routineId = 1;
// const actionName = "앉았다 일어나기";
// const actionCount = 5;
// const finDate = new Date();
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
// }).then((result) => console.log('Data is Created!'));

// // 가짜 데이터 만들기 - Character_DB
// const userId = 1;
// const preSet = 0;
// const characterName = "테스트2"
// models.Action.create({
//   userId : userId,
//   preSet : preSet,
//   characterName : characterName,
// }).then((result) => console.log('Data is Created!'));

// // -----------------------------------------------------------------------------


// // Read ------------------------------------------------------------------------
// models.Users.findAll().then(console.log);
// models.Users.findOne({ where: { userId: 'test88' } }).then(console.log);

// // -----------------------------------------------------------------------------


// // Update -----------------------------------------------------------------------

// models.User.findOne({ where: { nickName: 'test' } }).then((target) => {
//   console.log(target, 'if 전');
//   if (target) {
//     console.log(target, 'if 후');
//     target
//       .update({ userEmail: 'test1@test.com' })
//       .then((result) => console.log('Data is updated!'));
//   }
// });

// // -----------------------------------------------------------------------------


// // Delete -----------------------------------------------------------------------

// const targetUserId = 3;
// models.User.destroy({ where: { id: targetUserId } }).then((result) =>
//   console.log(result,"결과"),
//   console.log(`${targetUserId} data was deleted!`),
// );

// // -----------------------------------------------------------------------------