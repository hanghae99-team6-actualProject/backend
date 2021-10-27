const models = require('./models');

// // Creat ------------------------------------------------------------------------

// // 가짜 데이터 만들기 - User_DB
// models.User.create({
//   userEmail: 'tset2@test.com',
//   nickName: 'test2',
//   userPw: '2222',
//   providerId: '2222a',
//   provider: '',
//   exp: 1,
//   delType: 0,
//   role: 'smt',
// }).then((result) => console.log('Data1 is Created!'));


// 가짜 데이터 만들기 - Routine_DB
// 프리셋 데이터
// var routineName = "PSR1";
// var inMain = 0;
// var preSet = 1;
// models.Routine.create({
//   routineName : routineName,
//   inMain : inMain,
//   preSet: preSet,
// }).then((result) => console.log('Data is Created!'));
// var routineName = "PSR2";
// var inMain = 0;
// var preSet = 1;
// models.Routine.create({
//   routineName : routineName,
//   inMain : inMain,
//   preSet: preSet,
// }).then((result) => console.log('Data is Created!'));
// var routineName = "PSR3";
// var inMain = 0;
// var preSet = 1;
// models.Routine.create({
//   routineName : routineName,
//   inMain : inMain,
//   preSet: preSet,
// }).then((result) => console.log('Data is Created!'));

//  // 그냥 유저가 만든 루틴
// var finDate = new Date();
// models.Routine.create({
//   userId : 1,
//   routineName : "R1",
//   inMain : 0,
//   preSet : 0,
// }).then((result) => console.log('Data is Created!'));
// var finDate = new Date();
// models.Routine.create({
//   userId : 1,
//   routineName : "PSR1",
//   inMain : 0,
//   preSet : 1,
// }).then((result) => console.log('Data is Created!'));


// // 가짜 데이터 만들기 - Action_DB
// var userId = 1;
// var routineId = 5;
// var actionName = "앉았다 일어나기";
// var actionCount = 5;
// var finDate = new Date();
// var actionNum = 1;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 5;
// var actionName = "앉았다 일어나기";
// var actionCount = 5;
// var finDate = new Date();
// var actionNum = 2;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 5;
// var actionName = "앉았다 일어나기";
// var actionCount = 5;
// var finDate = new Date();
// var actionNum = 3;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));


// var userId = 1;
// var routineId = 5;
// var actionName = "발목 돌리기";
// var actionCount = 2;
// var finDate = new Date();
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 5;
// var actionName = "허리 스트레칭";
// var actionCount = 20;
// var finDate = new Date();
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 5;
// var actionName = "목 스트레칭";
// var actionCount = 3;
// var finDate = new Date();
// models.Action.create({
//   serId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 5;
// var actionName = "팔굽혀펴기";
// var actionCount = 10;
// var finDate = new Date();
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 5;
// var actionName = "팔 스트레칭";
// var actionCount = 5;
// var finDate = new Date();
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCount : actionCount,
//   finDate : finDate,
// }).then((result) => console.log('Data is Created!'));

// // 가짜 데이터 만들기 - Character_DB
// var userId = 1;
// var preSet = 1;
// var characterName = "1";
// var expMax = 1;
// var exp = 0;
// models.Character.create({
//   userId : userId,
//   preSet : preSet,
//   characterName : characterName,
//   exp: exp,
//   expMax : expMax,
// }).then((result) => console.log('Data is Created!'));

// var userId = 1;
// var preSet = 1;
// var characterName = "3"
// var expMax = 1;
// var exp = 0;
// models.Character.create({
//   userId : userId,
//   preSet : preSet,
//   characterName : characterName,
//   exp: exp,
//   expMax : expMax,
// }).then((result) => console.log('Data is Created!'));

// var userId = 1;
// var preSet = 1;
// var characterName = "2"
// var expMax = 0;
// var exp = 27;
// models.Character.create({
//   userId: userId,
//   preSet: preSet,
//   characterName: characterName,
//   exp: exp,
//   expMax: expMax,
// }).then((result) => console.log('Data is Created!'));

// // -----------------------------------------------------------------------------








// // Read ------------------------------------------------------------------------

// models.Users.findAll().then(console.log);
// models.Users.findOne({ where: { userId: 'test88' } }).then(console.log);
// const userId = 1;
// const routineId = 5;

// models.Action.findOne({ 
//   where: { userId: userId, routineId: routineId },
//   attributes: ['actionNum'],
//   order: [['actionNum', 'DESC']],
//   limit : 1,    
// }).then((result) => console.log(result));

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

// let finDate = new Date();
// models.Action.update({ finDate: finDate }, {where: { id: 12 } });
// console.log("완료");

// // -----------------------------------------------------------------------------






// // Delete -----------------------------------------------------------------------

// const targetUserId = 3; 
// models.Routine.destroy({ where: { userId: targetUserId } }).then((result) =>
//   console.log(result,"결과"),
//   console.log(`${targetUserId} data was deleted!`),
// );

// // -----------------------------------------------------------------------------