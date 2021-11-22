const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const env = require('./env')
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
    //DB의 고유 roomId를 참고하여 방에 join시킨다

    socketMoim.join(roomId, () => {
      console.log(`${userNickName} join a ${roomId}`);

      var msg = `${userNickName}님이 채팅방에 참가했습니다.`

      moimNamespace.to(roomId).emit('updateMsg', {
        name: SERVER,
        msg: msg,
      });
    });

  });

  socketMoim.on('enterNewRoom', async (newRoom, userNickName) => {
    //DB의 고유 roomId를 참고하여 방에 join시킨다
    console.log(newRoom);
    let roomId = newRoom.id

    socketMoim.join(roomId, () => {
      console.log(`${userNickName} join a ${roomId}`);
      
      var msg = `${userNickName}님이 채팅방에 참가했습니다.`
      
      moimNamespace.to(roomId).emit('updateMsg', {
        name: SERVER,
        msg: msg,
      });
    });

  });

  socketMoim.on('sendMsg', async (userNickName, msg) => {
    console.log('전송받은 data', userNickName);
    console.log('전송받은 data', msg);
    
    let targetRoomId = roomId

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


  // socketMoim.on('joinRoom', (roomNum, userNickName) => {
  //   //조인 룸이라는 이벤트를 받아들이고 진짜 조인 기능을 실행시킨다
  //   socketMoim.name = userNickName;

  //   console.log(socketMoim.name);


  //   socketMoim.join(roomNum, () => {
  //     console.log(`${userNickName} join a ${roomNum}`);


  //     //프론트로 이벤트를 던져줌
  //     moimNamespace.to(roomNum).emit('joinTargetRoom', roomNum, userNickName);
  //   })
  // });

  // socketMoim.on('newUserEnter', (data) => {
    
  //   console.log('newUserEnter에 넘어온 data', data);
  //   // console.log('newUserEnter에 넘어온 targetMoimChatroom', targetMoimChatroom);
  //   // console.log('newUserEnter에 넘어온 addChatUser', addChatUser);

  //   var msg = data + '님이 접속했습니다.';
  //   // console.log('서버 입장시 메세지', msg);
  //   console.log(msg);

  //   // var roomId = targetMoimChatroom.moimId;

  //   // moimNamespace.to(roomId).emit('updateMsg', { 
  //   moimNamespace.emit('updateMsg', { 
  //     name: 'SERVER',
  //     msg: msg,
  //   });
  // });



  // socketMoim.on('sendMsg', function (data) {
  //   // console.log('전송받은 data', data);
  //   console.log(socketMoim.name);

  //   data.name = socketMoim.name; //소켓 연결시 저장시켰던 socket.name을 불러와서 데이터의 이름값으로 전달
  //   // console.log('전송받은 것에 이름을 추가한 data', data);
    
  //   console.log(data);
  //   // data.name = userNickName;

  //   moimNamespace.emit('updateMsg', data);
  // });

  // socketMoim.on('disconnect', function () {
  //   // console.log(sock.id, "연결이 끊어졌어요!");

  //   var msg = socketMoim.name + '님이 퇴장하셨습니다';
  //   // console.log('서버가 송출하는 퇴장 메세지', msg);
  //   console.log(msg);

  //   // moimNamespace.to(roomId).emit('updateMsg', {
  //   moimNamespace.emit('updateMsg', {
  //     name: 'SERVER',
  //     msg: msg,
  //   });
  // });
});


if (env.NODE_ENV === 'production') {
  app.use(
    helmet({
      frameguard: false,
      contentSecurityPolicy: false,
      hsts: false,
    })
  );
  app.use(morgan('combined'));
  app.use(hpp());
} else {
  app.use(morgan('dev'))
}

sequelize
  .sync({ force: false }) //데이터 구조 변경하고 싶을 때, true
  .then(() => {
    console.log('------ SQL Restructure Complete ------');
  })
  .catch((error) => {
    console.error(error);
  });

if (env.NODE_ENV === 'production') {
  console.log('배포 환경입니다');
}

configurePassport(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));


//routes
// app.get('*', asyncErrorHandeler) 이것의 작동 방식을 모르겠습니다
app.use('/api', indexRouter);

//error handling
app.use(error404);
app.use(errorHandler)

//서버리슨 분리로 주석처리
// app.listen(port, () => {
//   console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
// });

userCron.destroyUser();

module.exports = { httpServer, io, moimNamespace };