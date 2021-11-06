const Sequelize = require('sequelize');
const models = require('./models');
const Op = Sequelize.Op;

// // Creat ------------------------------------------------------------------------

// // -----------------------------------------------------------------------------

// async function actionCreate(routineId, userId, actions) {
//   for await (const [index, value] of actions.entries()) {
//     console.log(index, value);
//     const { actionName, actionCnt, actionType } = value;
//     await models.Action.create({
//       routineId,
//       userId,
//       actionName,
//       actionCnt,
//       actionType,
//       actionNum: index
//     })
//     .then( async (result) => {
//       console.log( (result.actionNum+1) + '번째 AnctionFin 생성');
//       await models.ActionFin.create({
//         actionId: result.id,
//       })
//       .then(() => console.log('ActionFin 생성완료'))
//       .catch((err) => { if(err) next(new Error('ActionFin 생성 db 에러')) });
//     })
//   }
//   console.log('action 생성 완료')
// }

// var routineName = "점심루틴";

// const actions = [
//   {
//     actionName : "스쿼트",
//     actionCnt : "10",
//     actionType : "스트레칭",
//   },{
//     actionName : "팔굽혀펴기",
//     actionCnt : "10",
//     actionType : "스트레칭",
//   },{
//     actionName : "플랭크",
//     actionCnt : "3",
//     actionType : "스트레칭",
//   },
// ]
// const routineId = 2;
// const userId = 2;

// actionCreate(routineId, userId, actions)


// // -----------------------------------------------------------------------------



// // 가짜 데이터 만들기 - User_DB
// models.User.create({
//   providerId: "2",
//   userEmail: 'tset2@test.com',
//   nickName: 'test2',
//   userPw: '1112',
// }).then((result) => {
//   console.log('Data1 is Created!');
//   console.log(result.id);
//   console.log("============여기까지!======================");
// });


// models.User.create({
//   providerId: "4",
//   userEmail: 'tset4@test.com',
//   nickName: 'test4',
//   userPw: '4444',
// }).then((result) => console.log('Data1 is Created!'));
// models.User.create({
//   providerId: "5",
//   userEmail: 'tset5@test.com',
//   nickName: 'test5',
//   userPw: '5555',
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

 // 그냥 유저가 만든 루틴
// var finDate = new Date();
// models.Routine.create({
//   userId : 1,
//   routineName : "2",
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
// for(let i=0; i < 6; i++){
//   var userId = 2;
//   var routineId = 2;
//   var actionName = "앉았다 일어나기";
//   var actionCnt = 5;
//   var finDate = new Date();
//   var actionNum = i;
//   models.Action.create({
//     userId : userId,
//     routineId : routineId,
//     actionName : actionName,
//     actionCnt : actionCnt,
  
//     actionNum : actionNum,
//   })
// }

// var userId = 2;
// var routineId = 2;
// var actionName = "팔굽혀 펴기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 2;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 2;
// var routineId = 2;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 3;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 2;
// var routineId = 2;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 4;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 5;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 6;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 7;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 8;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 9;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 10;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 11;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 12;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 13;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 14;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 15;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 16;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 17;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 18;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 19;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 20;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 21;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

//   actionNum : actionNum,
// }).then((result) => console.log('Data is Created!'));
// var userId = 1;
// var routineId = 1;
// var actionName = "고개돌리기";
// var actionCnt = 5;
// var finDate = new Date();
// var actionNum = 22;
// models.Action.create({
//   userId : userId,
//   routineId : routineId,
//   actionName : actionName,
//   actionCnt : actionCnt,

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

// var userId = 2;
// var preSet = 1;
// var characterName = "2"
// var expMax = 1;
// var exp = 0;
// models.Character.create({
//   userId: userId,
//   preSet: preSet,
//   characterName: characterName,
//   exp: exp,
//   expMax: expMax,
// }).then((result) => console.log('Data is Created!'));
// var userId = 2;
// var preSet = 1;
// var characterName = "1"
// var expMax = 0;
// var exp = 15;
// models.Character.create({
//   userId: userId,
//   preSet: preSet,
//   characterName: characterName,
//   exp: exp,
//   expMax: expMax,
// }).then((result) => console.log('Data is Created!'));

// // -----------------------------------------------------------------------------

// async function actionCreate(routineId, userId, actions) {
//   for await (const [index, value] of actions.entries()) {
//     console.log(index, value);
//     const { actionName, actionCnt, actionType } = value;
//     await models.Action.create({
//       routineId,
//       userId,
//       actionName,
//       actionCnt,
//       actionType,
//       actionNum: index
//     })
//     .then( async (result) => {
//       console.log( result.actionCnt + '번째 AnctionFin 생성');
//       await models.ActionFin.create({
//         actionId: result.id,
//       })
//       .then(() => console.log('ActionFin 생성완료'))
//       .catch((err) => { if(err) next(new Error('ActionFin 생성 db 에러')) });
//     })
//   }
//   console.log('action 생성 완료')
// }

// var routineName = "점심루틴";

// const actions = [
//   {
//     actionName : "스쿼트",
//     actionCnt : "10",
//     actionType : "스트레칭",
//   },{
//     actionName : "팔굽혀펴기",
//     actionCnt : "10",
//     actionType : "스트레칭",
//   },{
//     actionName : "플랭크",
//     actionCnt : "3",
//     actionType : "스트레칭",
//   },
// ]
// const routineId = 1;
// const userId = 1;

// actionCreate(routineId, userId, actions)






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

// const target = 2; 
// models.ActionFin.destroy({ where: { actionid: { [Op.gte]: 4 } }}).then((result) =>
//   console.log(result,"결과"),
//   console.log(`${target} data was deleted!`),
// );

// async function actionDelete(routineId) {
//   await models.Action.destroy({
//     where: { routineId }
//   })
//   console.log('action 및 actionFin 삭제 완료')
//   // 액션이 삭제되면서 ActionFin에 있는 데이터도 같이 삭제되길 기대함
//   // 안삭제되면 문제!
//   // 테스트 필요
// };

// const routineId = 2;
// actionDelete(routineId);

// // -----------------------------------------------------------------------------