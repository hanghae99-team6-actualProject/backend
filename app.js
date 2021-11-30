const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const env = require('./env');
const logger = require('./logger');
const path = require('path');
const { createServer } = require('http');


const configurePassport = require('./passport')
const { sequelize } = require("./models");
//routes imports
const indexRouter = require("./routes/index");
const { errorHandler, error404, asyncErrorHandeler } = require('./middlewares/errorMiddleware');

//crons imports
const userCron = require("./crons/user");

//서버리슨 분리로 주석처리
// const port = env.EXPRESS_PORT;

//채팅방
const { Server } = require("socket.io");
const app = express()
const httpServer = createServer(app);
// const io = new Server(httpServer);
const io = new Server(httpServer, { cors: { origin: "*" } });
app.set('io', io);


// ejs 읽기!
app.use(express.static(path.join(__dirname, "views")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use('/chattt', (req, res) => {
  return res.render('chatIndex');
});

app.use('/chat/:moimId', (req, res) => {
  return res.render('chatIndex');
});

// server.on('request', function(req, res) {
//   const moimId = 3;
//   if(req.method == "GET" && req.url == `/chat/${moimId}`) {
//     return res.render('chatIndex');
//   }
// });

const moimNamespace = io.of(`/chat`);
app.set('moimNamespace', moimNamespace);

let roomId = '';

//특정 네임스페이스 지정시의 코드
moimNamespace.on('connection', (socketMoim) => {
  console.log("====================================================")
  console.log("moim 네임스페이스 접속");
  // console.log("socketMoim", socketMoim);

  socketMoim.on('enterNewUser', async (userNickName, targetRoomId) => {
    socketMoim.name = userNickName;
    console.log('방 입장유저 닉네임', socketMoim.name)
    roomId = targetRoomId;
    console.log(roomId);
    //DB의 고유 roomId를 참고하여 방에 join시킨다

    // socketMoim.join(roomId, () => {
    //   console.log(userNickName + ' is join a room#' + roomId );

    socketMoim.join(roomId);
    var msg = userNickName + '님이 채팅방에 참가했습니다.'

    moimNamespace.to(roomId).emit('updateMsg', {
      name: 'SERVER',
      msg: msg,
    });
  });

  socketMoim.on('leaveRoom', async (userNickName, targetRoomId) => {
    // 프론트로부터 전달 받은 roomId를 타겟으로 하여 방에서 leave시킨다
    console.log(userNickName)
    console.log(targetRoomId)

    socketMoim.leave(targetRoomId);

    var msg = userNickName + '님이 퇴장하셨습니다';
    console.log('퇴장 메세지', msg);

    moimNamespace.to(targetRoomId).emit('updateMsg', {
      name: 'SERVER',
      msg: msg,
    });
  })

  socketMoim.on('enterNewRoom', async (newRoom, userNickName) => {
    //DB의 고유 roomId를 참고하여 방에 join시킨다
    console.log(newRoom);
    let roomId = newRoom.id

    socketMoim.join(roomId)
    var msg = userNickName + '님이 채팅방에 참가했습니다.'

    moimNamespace.to(roomId).emit('updateMsg', {
      name: 'SERVER',
      msg: msg,
    });
  });



  socketMoim.on('sendMsg', async (userNickName, msg, FromProntRoomId) => {
    console.log('전송받은 data', userNickName);
    console.log('전송받은 data', msg);

    let targetRoomId = FromProntRoomId

    moimNamespace.to(targetRoomId).emit('updateMsg', {
      name: userNickName,
      msg: msg,
    });
  });

  socketMoim.on('disconnect', function () {
    // console.log(sock.id, "연결이 끊어졌어요!");
    let targetRoomId = roomId;
    console.log(targetRoomId);

    socketMoim.leave(targetRoomId);

    console.log("디스커넥티드의 socketMoim.name", socketMoim.name);
    var msg = socketMoim.name + '님이 퇴장하셨습니다';
    console.log('퇴장 메세지', msg);

    moimNamespace.to(targetRoomId).emit('updateMsg', {
      // moimNamespace.emit('updateMsg', {
      name: 'SERVER',
      msg: msg,
    });
  });
});


if (env.NODE_ENV === 'production') {
  app.use(
    helmet({
      frameguard: false,
      contentSecurityPolicy: false,
      hsts: false,
    })
  );
  // production 환경일 때 morgan -> winston에서 로그 출력 및 파일 기록
  // app.use(morgan('combined'));
  app.use(morgan('combined', { stream: logger.stream }));

  app.use(hpp());
} else {
  // app.use(morgan('dev'))
  app.use(morgan('dev', { stream: logger.stream }))
}

sequelize
  .sync({ force: false }) //데이터 구조 변경하고 싶을 때, true
  .then(() => {
    logger.info('------ SQL Restructure Complete ------');
  })
  .catch((error) => {
    logger.error(error);
  });


if (env.NODE_ENV === 'production') {
  logger.info('배포 환경입니다');
}

configurePassport(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));


//routes
// app.get('*', asyncErrorHandeler) 이것의 작동 방식을 모르겠습니다
app.use('/api', indexRouter);

//error handling
app.use(error404);
app.use(errorHandler)

userCron.destroyUser();

module.exports = { httpServer, io };