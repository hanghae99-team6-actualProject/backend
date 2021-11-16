var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getAllMoim, detailMoim, createMoim, updateMoim, deleteMoim, enterMoim, exitMoim } = require('../controllers/moims');

//API
router.get('/', getAllMoim); //미들웨어 제거
router.post('/', authMiddleware, createMoim);
router.get('/:moimId', authMiddleware, detailMoim);
router.put('/:moimId', authMiddleware, updateMoim);
router.delete('/:moimId', authMiddleware, deleteMoim);
router.post('/:moimId', authMiddleware, enterMoim);
router.post('/:moimId/exit', authMiddleware, exitMoim);

//likes moved
//controller import
const { createLike, getMyLikes, deleteLike } = require('../controllers/likes');

//API
router.get('/like/', authMiddleware, getMyLikes);
router.post('/like/:moimId', authMiddleware, createLike);
router.delete('/like/:moimId', authMiddleware, deleteLike);

//comments moved
//controller import
const { getAllComments, getTargetMoimComments, createComment, updateComment, deleteComment } = require('../controllers/comments');

//API
router.get('/comment/', authMiddleware, getAllComments);
router.get('/comment/:moimId', authMiddleware, getTargetMoimComments); //특정 모임에 대한 댓글 불러오기
router.post('/comment/:moimId', authMiddleware, createComment);
router.put('/comment/:commentId', authMiddleware, updateComment);
router.delete('/comment/:commentId', authMiddleware, deleteComment);

// // 채팅방

// //방만들기 함수
// const createNewRoom = async (moimId, result) => {
//   try {
//     const setNewRoom = await Room.create({
//       moimId,
//     }).catch((err) => {
//       console.log("에러에러")
//       if (err) next(new Error('모임 채팅방 생성 중 db 에러'))
//     });

//     result = setNewRoom;
//     return;

//   } catch (err) {
//     console.log(err);
//     console.log('catch에서 에러감지');
//     return next(myError(400, err.message));
//   }
// }

// // 방 만들기
// router.post('/:moimId/chat', async (req, res, next) => {
//   try {
//     console.log('createChatRomm router 진입');
//     if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

//     const userId = res.locals.user.id;
//     const { moimId } = req.params;

//     const isroom = await MoimChatRoom.findAll({
//       where : { moimId }
//     }).catch((err) => {
//       console.log("에러에러")
//       if (err) next(new Error('모임 채팅방 생성 중 db 에러'))
//     });
    

//     const newRoom; //함수 안에서 밖으로 빼내기 위한 변수, 새로운 채팅방을 담는다

//     if(isroom.length > 0) { //현재 방이 존재하는 경우 >> 입장하기로 들어가야함
//       return next(myError(500, '이미 채팅방이 존재합니다. 입장하기 버튼을 눌러주세요.'));
//     }

//     createNewRoom(moimId, newRoom) // 함수로 새로운 채팅방을 만드는 동작을 정의
//     console.log(newRoom);

//     res.status(200).send({
//       result : true,
//       newRoom,
//       msg: "채팅방 생성이 완료되었습니다."
//     });

//   } catch(err) {
//     console.log(err);
//     console.log('catch에서 에러감지');
//     return next(myError(400, err.message));
//   }
// }) 


// // 방 입장하기
// router.get('/:moimId/chat', async (req, res, next) => { 
//   try {
//     console.log('makeChatRomm router 진입');
//     if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

//     const userId = res.locals.user.id;
//     const { moimUserId } = req.body;
//     const { moimId } = req.params;

//     //조건을 줘야함. 조건에 해당하는 필요한 모임을 찾아 연결하고, 없으면 새로 만든다
//     const targetMoimChatromm = await Room.findOne({ 
//       where: { moimId },
//     }).catch((err) => {
//       console.log("에러에러")
//       if (err) next(new Error('모임 채팅방 찾기 중 db 에러'))
//     });

//     if(targetMoimChatromm.length === 0) {
//       return next(myError(400, '현재 채팅방이 없습니다. 생성하기 버튼을 눌러주세요.'));
//     };

//     const addChatUser = await MoimChatRoom.update(
//       { moimUserId },
//       { where: {id: targetMoimChatromm.id}},
//     ).catch((err) => {
//       console.log("에러에러")
//       if (err) next(new Error('모임 채팅방 유저 등록 중 db 에러'))
//     });

//     res.status(400).send({
//       result: true,
//       moimChatromm : targetMoimChatromm,
//       msg: '채팅방 입장에 성공했습니다.',
//     });

//   } catch (err) {
//     console.log(err);
//     console.log('catch에서 에러감지');
//     return next(myError(400, err.message));
//   }
// })

// // 방 나가기
// router.delete('/:moimId/chat', async (req, res, next) => { 
//   try {
//     console.log('exitChatRomm router 진입');
//     if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

//     const userId = res.locals.user.id;
//     const { moimUserId } = req.body;

//     const exitRomm = await MoimChatRoom.destroy({
//       where: {moimUserId: moimUserId},
//     }).catch((err) => {
//       console.log("에러에러")
//       if (err) next(new Error('모임 채팅방 유저 삭제 중 db 에러'))
//     });

//    if(exitRomm !== 1) {
//     return next(myError(400, '해당 채팅방의 유저가 아닙니다.')); //아마 벌어질 일이 없을 것으로 예상
//    }

//    res.status(200).send({
//      result: true,
//      msg: "채팅방 나가기에 성공했습니다.",
//    })

//   } catch (err) {
//     console.log(err);
//     console.log('catch에서 에러감지');
//     return next(myError(400, err.message));
//   }
// });


// // 방 삭제하기
// router.delete('/:moimId/:chatRoomId', async (req, res, next) => { 
//   try {
//     console.log('outChatRomm router 진입');
//     if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

//     const userId = res.locals.user.id;
//     const { chatRoomId } = req.params;
    
//     const deleteRomm = await MoimChatRoom.destroy({
//       where: {id: chatRoomId},
//     }).catch((err) => {
//       console.log("에러에러")
//       if (err) next(new Error('모임 채팅방 삭제 중 db 에러'))
//     });

//     if( deleteRomm !== 1 ) {
//       return next(myError(400, '해당 채팅방 없습니다.'));
//     }

//     return res.status(200).send({
//       result: true,
//       msg: '채팅방 삭제에 성공했습니다.'
//     })

//   } catch (err) {
//     console.log(err);
//     console.log('catch에서 에러감지');
//     return next(myError(400, err.message));
//   }
// });



module.exports = router;