const { Chat, MoimChatRoom } = require('../models');
const { io } = require('../socket');
const myError = require('./utils/httpErrors')

//방만들기 함수
const createNewRoom = async (moimId, userId) => {
  try {
    const setNewRoom = await MoimChatRoom.create({
      moimId,
      userId,
    })

    console.log("함수안의 셋뉴룸", setNewRoom);

    return setNewRoom;

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

const createChatRoom = async (req, res, next) => {
  try {
    console.log('createChatRomm router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params;

    const isroom = await MoimChatRoom.findAll({
      where : { moimId }
    }).catch((err) => {
      console.log("에러에러")
      if (err) return next(new Error('모임 채팅방 생성 중 db 에러'))
    });
    
    console.log("이즈룸", isroom);
    // var newRoom = []; //함수 안에서 밖으로 빼내기 위한 변수, 새로운 채팅방을 담는다

    if(isroom.length > 0) { //현재 방이 존재하는 경우 >> 입장하기로 들어가야함
      return next(myError(500, '이미 채팅방이 존재합니다. 입장하기 버튼을 눌러주세요.'));
    }

    const newRoom = await createNewRoom(moimId, userId) // 함수로 새로운 채팅방을 만드는 동작을 정의
    console.log("newRoomInfo", newRoom);

    // const io = req.app.use(io);
    io.of(`/chat/${moimId}`).emit('newRoom', newRoom); // 새로운 방 생성이라는 이벤트를 던져준다
    
    //소켓 io의 js가 들어간 프론트가 있어야한다.
    return res.status(200).send({ //상태 메세지를 보내거나 리다이렉트를 해야한다.
      result : true,
      newRoom,
      msg: "채팅방 생성이 완료되었습니다."
    });

  } catch(err) {
    console.log(err);
    return next(err);
  }
}

const enterChatRoom = async (req, res, next) => { 
  try {
    console.log('makeChatRomm router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimUserId } = req.body;
    const { moimId } = req.params;

    //조건을 줘야함. 조건에 해당하는 필요한 모임을 찾아 연결하고, 없으면 새로 만든다
    const targetMoimChatromm = await MoimChatRoom.findOne({ 
      where: { moimId, deleteAt: null },
    }).catch((err) => {
      console.log("에러에러")
      if (err) return next(new Error('모임 채팅방 찾기 중 db 에러'))
    });

    if(targetMoimChatromm.length === 0) {
      return next(myError(400, '현재 채팅방이 없습니다. 생성하기 버튼을 눌러주세요.'));
    };

    const addChatUser = await MoimChatRoom.update( //채팅방 사용 유저로 db에 추가 크리에이트로채팅멤버
      { moimUserId },
      { where: {id: targetMoimChatromm.id}},
    ).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('모임 채팅방 유저 등록 중 db 에러'))
    });

    //그 후 새로운 채팅방 생성때와 같이 랜더링이 필요함

    // const io = req.app.use(io);
    io.of(`/chat/${moimId}`).emit('newRoom', targetMoimChatromm); // 새로운 방 생성이라는 이벤트를 던져준다

    // 기존에 있던 모든 대화를 끌어온다.
    const chats = await Chat.findAll({
      where: {moimId}
    }).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('타겟 채팅방 대화 내용 불러오기 중 db 에러'))
    });

    res.status(400).send({
      result: true,
      moimChatromm : targetMoimChatromm,
      chats: chats,
      msg: '채팅방 입장에 성공했습니다.',
    });

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

const outChatRoom = async (req, res, next) => { 
  try {
    console.log('exitChatRomm router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimUserId } = req.body;

    const exitRomm = await MoimChatRoom.destroy({
      where: {moimUserId: moimUserId},
    }).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('모임 채팅방 유저 삭제 중 db 에러'))
    });

   if(exitRomm !== 1) {
    return next(myError(400, '해당 채팅방의 유저가 아닙니다.')); //아마 벌어질 일이 없을 것으로 예상
   }

   res.status(200).send({
     result: true,
     msg: "채팅방 나가기에 성공했습니다.",
   })

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

const deleteChatRoom = async (req, res, next) => { 
  try {
    console.log('outChatRomm router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { chatRoomId } = req.params.chatRoomId;
    
    const deleteRomm = await MoimChatRoom.update(
      {
        deletAt: new Date()
      }, 
      {
        where: {id: chatRoomId}
      },
    ).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('모임 채팅방 삭제 중 db 에러'))
    });

    if( deleteRomm !== 1 ) {
      return next(myError(400, '해당 채팅방 없습니다.'));
    }

    setTimeout(() => { // 프론트에서 처리하는 작업
      req.app.get('io').of(`/chat/${moimId}`).emit('removeRoom', req.params.chatRoomId);
    }, 2000);

    return res.status(200).send({
      result: true,
      msg: '채팅방 삭제에 성공했습니다.'
    })

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

const loadTargetChat = async (req, res, next) => { 
  try {
    console.log('loadChating router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    // 기존에 있던 모든 대화를 끌어온다.
    const chats = await Chat.findAll({
      where: {moimId},
      include: [
        {
          model: MoimUser,
          attributes: ['id', 'userId', 'host'],
          include: [
            {
              model: User,
              attributes: ['nickName'],
            },
          ],
        },
      ]
    }).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('타겟 채팅방 대화 내용 불러오기 중 db 에러'))
    });

    return res.status(200).send({
      result: true,
      chats,
      msg: '특정 채팅방 모든 대화 불러오기에 성공했습니다.'
    })

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}

const saveChat = async (req, res, next) => { 
  try {
    console.log('saveChating router 진입');
    if (!res.locals.user) return next(myError(401, '로그인되어있지 않습니다'));

    const userId = res.locals.user.id;
    const { moimId } = req.params.moimId;
    const { chatRoomId } = req.params.chatRoomId;
    const { contents } = req.body;

    const targetmoimUser = await moimUser.findOne({
      where: {userId: userId, moimId: moimId}
    }).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('모임의 타겟 이용 유저 정보 불러 오기 중 db 에러'))
    });

    console.log('현재 화면을 보고있는 타겟 유저 정보',targetmoimUser);
    console.log('현재 화면을 보고있는 타겟 유저 정보',targetmoimUser.id);

    const saveChat = await Chat.create({
      moimUserId: targetmoimUser.id,
      chatRoomId,
      contents,
    }).catch((err) => {
      console.log("에러에러")
      if (err) next(new Error('타겟 채팅방 대화 내용 저장 중 db 에러'))
    });

    return res.status(200).send({
      result: true,
      msg: "채팅 내용 저장에 성공했습니다."
    });

  } catch (err) {
    console.log(err);
    console.log('catch에서 에러감지');
    return next(myError(400, err.message));
  }
}


module.exports = { 
  createChatRoom,
  enterChatRoom,
  outChatRoom,
  deleteChatRoom,
  loadTargetChat,
  saveChat,
}