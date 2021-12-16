var redis = require('redis');
console.log(redis);
var client = redis.createClient({
  host: 'mingijuk1-redis-001.vbxg1n.0001.apn2.cache.amazonaws.com',
  port: 6379,
});

client.on('connect', function () {
  logger.info('Connected Redis');
});

client.on('error', function (err) {
  logger.info('Error' + err);
});

const { User, MoimUser, Chat, MoimChatRoom, MoimChatUser, Notice } = require('../models');
const myError = require('./utils/httpErrors')
const logger = require('../logger');

//시간
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
// logger.info(moment().format('YYYY-MM-DD HH:mm:ss'));

//방만들기 함수
const createNewRoom = async (moimId, userId) => {
  const setNewRoom = await MoimChatRoom.create({
    moimId,
    userId,
  });

  return setNewRoom;
}

//채팅 로드 함수
const loadChatList = async (chatRoomId, callback) => {
  client.hgetall(`${chatRoomId}`, function (err, object) {
    // logger.info('정의 안의 object', object)
    callback(object);
  });
};

const createChatRoom = async (req, res, next) => {
  try {
    logger.info('createChatRomm router 진입');
    const userId = res.locals.user.id;
    const { moimId } = req.params;

    const isroom = await MoimChatRoom.findAll({
      where: { moimId }
    });

    logger.info("이즈룸", isroom);
    // var newRoom = []; //함수 안에서 밖으로 빼내기 위한 변수, 새로운 채팅방을 담는다

    if (isroom.length > 0) { //현재 방이 존재하는 경우 >> 입장하기로 들어가야함 >> 그냥 바로 프론트에 입장하기로 쏴줌
      let roomId = isroom[0].dataValues.id;


      return res.status(200).send({
        result: "true2",
        isroom,
        roomId,
        msg: "이미 채팅방이 존재합니다. 기존의 채팅방으로 안내합니다."
      });
    }

    const newRoom = await createNewRoom(moimId, userId) // 함수로 새로운 채팅방을 만드는 동작을 정의
    logger.info("newRoomInfo", newRoom);

    // // const io = req.app.get('io');
    // const moimNamespace = req.app.get('moimNamespace');
    // moimNamespace.emit('createNewRoom', newRoom ); // 새로운 방 생성이라는 이벤트를 던져준다

    await client.hmset(`${newRoom.id}`, 'chatNum', 0);
    return res.status(200).send({ //상태 메세지를 보내거나 리다이렉트를 해야한다.
      result: "true1",
      newRoom,
      roomId: newRoom.id,
      msg: "채팅방 생성이 완료되었습니다."
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const enterChatRoom = async (req, res, next) => {
  try {
    logger.info('makeChatRomm router 진입');
    const userId = res.locals.user.id;
    const { moimUserId, nickName } = req.body;
    const { moimId } = req.params;

    //조건을 줘야함. 조건에 해당하는 필요한 모임을 찾아 연결하고, 없으면 새로 만든다
    const targetMoimChatroom = await MoimChatRoom.findOne({
      where: { moimId, deleteAt: null },
    })

    if (!targetMoimChatroom) {
      return next(myError(400, '현재 채팅방이 없습니다. 생성하기 버튼을 눌러주세요.'));
    };

    const addChatUser = await MoimChatUser.create({ //채팅방 사용 유저로 db에 추가 크리에이트로채팅멤버
      moimUserId,
      moimChatRoomId: targetMoimChatroom.id,
    });

    //그 후 새로운 채팅방 생성때와 같이 랜더링이 필요함
    // const roomId = moimId;

    // const moimNamespace = req.app.get('moimNamespace');
    // moimNamespace.to(roomId).emit('newUserEnter', targetMoimChatroom, addChatUser); // 새로운 방 생성이라는 이벤트를 던져준다
    // // moimNamespace.emit('newRoom', targetMoimChatroom); // 새로운 방 생성이라는 이벤트를 던져준다

    // 기존에 있던 모든 대화를 끌어온다.
    const chats = await Chat.findAll({
      where: { moimChatRoomId: targetMoimChatroom.id }
    })

    res.status(200).send({
      result: true,
      moimChatroom: targetMoimChatroom,
      moimChatroomId: targetMoimChatroom.id,
      chats: chats,
      msg: '채팅방 유저 등록에 성공했습니다.',
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const exitChatRoom = async (req, res, next) => {
  try {
    logger.info('exitChatRomm router 진입');
    const userId = res.locals.user.id;
    const { moimId, chatRoomId } = req.params;
    const { moimUserId } = req.body;

    const exitRoom = await MoimChatUser.destroy({
      where: { moimUserId, moimChatRoomId: chatRoomId },
    })

    if (exitRoom !== 1) {
      return next(myError(400, '해당 채팅방의 유저가 아닙니다.')); //아마 벌어질 일이 없을 것으로 예상
    }

    //  const roomNum = moimId;
    //  moimNamespace.to(roomNum).emit('exitRoom', roomNum);

    res.status(200).send({ //해당 메세지를 받으면 채팅방에서 튕겨내야 함
      result: true,
      msg: "채팅방 유저 나가기에 성공했습니다.",
    })

  } catch (err) {
    return next(err);
  }
}

const deleteChatRoom = async (req, res, next) => {
  try {
    logger.info('outChatRomm router 진입');
    // logger.info("파람스",req.params);
    const { moimId, chatRoomId } = req.params;

    // isHost 는 나중에

    const date = new Date();

    const deleteChatRoom = await MoimChatRoom.update(
      { deleteAt: date },
      { where: { id: chatRoomId } },
    )

    logger.info(deleteChatRoom[0]);

    if (deleteChatRoom[0] !== 1) {
      return next(myError(500, '삭제할 채팅방이 DB에 존재하지 않습니다.'));
    }

    // // 프론트에서 처리하는 작업
    // const moimNamespace = req.app.get('moimNamespace');
    // moimNamespace.emit('removeRoom', chatRoomId ); // 새로운 방 생성이라는 이벤트를 던져준다

    return res.status(200).send({
      result: true,
      targetChatRoomId: chatRoomId,
      msg: '채팅방 삭제에 성공했습니다.'
    })

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const loadTargetChat = async (req, res, next) => {
  try {
    logger.info('loadChating router 진입');
    const { moimId, chatRoomId } = req.params
    logger.info(req.params);

    // 특정 채팅방의 속한 모든 대화를 끌어온다.
    // const chats = await Chat.findAll({
    //   where: { moimChatRoomId: chatRoomId },
    //   include: [
    //     {
    //       model: MoimUser,
    //       attributes: ['id', 'userId', 'host'],
    //       include: [
    //         {
    //           model: User,
    //           attributes: ['nickName'],
    //         },
    //       ],
    //     },
    //   ]
    // })

    // client.hgetall(`${chatRoomId}`, async (err, results) => {
    //   logger.info('채팅방'+ chatRoomId +'의 대화 목록', results);
    //   return results
    // });

    await loadChatList(chatRoomId, function (obj) {
      // logger.info("여기가 함수 안", obj);
      const chats = Object.entries(obj).map((element) => {
        const key = element[0].split('_');
        const value = element[1];
        return { id: key[3], nickName: key[0], url: key[1], contents: value, createAt: key[2] }
      });

      return res.status(200).send({
        result: true,
        chats,
        msg: '특정 채팅방 모든 대화 불러오기에 성공했습니다.',
      });
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const saveChat = async (req, res, next) => {
  try {
    logger.info('saveChating router 진입');
    const userId = res.locals.user.id;
    const { moimId, chatRoomId } = req.params;
    const { contents, url } = req.body;


    logger.info("userId", userId);
    logger.info(req.params);
    logger.info('contents', contents);

    if (contents.length > 250) {
      return next(myError(400, "글자수는 250자 이하만 가능합니다"));
    }

    const targetMoimUser = await MoimUser.findOne({
      where: { userId: userId, moimId: moimId },
      include: [
        {
          model: User,
          attributes: ['nickName']
        }
      ]
    });

    // logger.info('현재 화면을 보고있는 타겟 유저 정보', targetMoimUser);
    logger.info('현재 화면을 보고있는 타겟 유저 정보 id', targetMoimUser.id);
    logger.info('현재 화면을 보고있는 타겟 유저 정보 id', targetMoimUser.User.nickName);

    if (!targetMoimUser) {
      return next(myError(500, '해당 모임의 참여자가 아닙니다'));
    }

    //현재시간
    let createAt = moment().format('YYYY-MM-DD HH:mm:ss')
    logger.info('현재 한국 시간', createAt);

    // const saveChat = await Chat.create({
    //   moimUserId: targetMoimUser.id,
    //   moimChatRoomId: chatRoomId,
    //   contents: contents,
    // })
    // logger.info('saveChat', saveChat);

    client.hget(`${chatRoomId}`, 'chatNum', async (err, result) => {
      logger.info(result);
      const chatNum = Number(result) + 1;
      client.hmset(`${chatRoomId}`, 'chatNum', chatNum);
      client.hmset(`${chatRoomId}`, `${targetMoimUser.User.nickName}_${url}_${createAt}_${chatNum}`, `${contents}`)
    });

    // await client.hmset(`${chatRoomId}`, `${targetMoimUser.User.nickName}_chat`, `${contents}` )



    // const saveChatElements = {
    //   "id": saveChat.id,
    //   "moimUserId": saveChat.moimUserId,
    //   "moimChatRoomId": saveChat.moimChatRoomId,
    //   "contents": saveChat.contents,
    // }

    // return res.status(200).send({
    //   result: true,
    //   saveChat,
    //   saveChatElements,
    //   msg: "채팅 내용 저장에 성공했습니다."
    // });

    return res.status(200).send({
      result: true,
      msg: "채팅 내용 저장에 성공했습니다."
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const getAllNotice = async (req, res, next) => {
  try {
    logger.info('getAllNotice router 진입');
    const allNotice = await Notice.findAll({});
    logger.info("전체 공지", allNotice);

    return res.status(200).send({
      resutl: true,
      allNotice: allNotice,
      msg: "전체 공지 불러오기에 성공했습니다."
    });

  } catch (err) {
    logger.info(err);
    return next(err);
  }
}

const makeNotice = async (req, res, next) => {
  try {
    logger.info('makeNotice router 진입');
    const userId = res.locals.user.id;
    const { moimId, chatRoomId } = req.params;
    const { contents } = req.body;

    const isHost = await MoimUser.findOne({ // 해당 모임에 참여중인지, 호스트인지 확인
      where: {
        userId: userId,
        moimId: moimId,
        host: 1
      }
    });

    if (!isHost) {
      return next(myError(500, '해당 모임의 호스트가 아닙니다'));
    }

    const isNotice = await Notice.findAll({ // 해당 모임 채팅방에 공지가 있는지 여부 확인
      where: { moimChatRoomId: chatRoomId }
    });

    if (isNotice.length !== 0) {
      return next(myError(500, '이미 공지가 존재합니다.'));
    }

    const makeNotice = await Notice.create({
      moimId,
      moimChatRoomId: chatRoomId,
      contents,
    })

    return res.status(200).send({ //공지로 등록한 문구를 프론트로 전달
      result: true,
      notice: makeNotice,
      noticeId: makeNotice.id,
      msg: "공지 등록에 성공했습니다."
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const getTargetNotice = async (req, res, next) => {
  try {
    logger.info('getTargetNotice router 진입');
    const userId = res.locals.user.id;
    const { moimId, chatRoomId } = req.params;

    const targetNotice = await Notice.findOne({
      where: { moimId, moimChatRoomId: chatRoomId }
    })

    return res.status(200).send({
      result: true,
      targetNotice,
      msg: "특정 모임 채팅방의 공지를 불러오기에 성공했습니다."
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const updateNotice = async (req, res, next) => {
  try {
    logger.info('updateNotice router 진입');
    const userId = res.locals.user.id;
    const { moimId, chatRoomId, noticeId } = req.params;
    const { contents } = req.body;

    const isNotice = await Notice.findOne({
      where: {
        id: noticeId,
        moimId,
        moimChatRoomId: chatRoomId,
      }
    })

    if (!isNotice) {
      return next(myError(500, '등록된 공지가 없습니다.'));
    }

    const updateNotice = await Notice.update(
      { contents: contents },
      { where: { id: noticeId } },
    );

    if (updateNotice == 0) {
      return next(myError(500, '공지 수정에 실패했습니다.'));
    }

    const nowNotice = await Notice.findOne({
      where: { id: noticeId },
    });

    return res.status(200).send({
      result: true,
      nowNotice: nowNotice,
      msg: "공지 수정에 성공했습니다.",
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

const deleteNotice = async (req, res, next) => {
  try {
    logger.info('deleteNotice router 진입');
    const userId = res.locals.user.id;
    const { moimId, chatRoomId, noticeId } = req.params;

    const isNotice = await Notice.findOne({
      where: {
        id: noticeId,
        moimId,
        moimChatRoomId: chatRoomId,
      },
    })

    if (!isNotice) {
      return next(myError(500, '등록된 공지가 없습니다.'));
    }

    const deleteNotice = await Notice.destroy({
      where: { id: noticeId },
    });

    if (deleteNotice == 0) {
      return next(myError(500, '공지 삭제에 실패했습니다.'));
    }

    return res.status(200).send({
      result: true,
      targetNotice: isNotice,
      msg: "공지 삭제에 성공했습니다.",
    });

  } catch (err) {
    logger.error(err);
    return next(err);
  }
}

module.exports = {
  createChatRoom,
  enterChatRoom,
  exitChatRoom,
  deleteChatRoom,
  loadTargetChat,
  saveChat,
  getAllNotice,
  makeNotice,
  getTargetNotice,
  updateNotice,
  deleteNotice,
}