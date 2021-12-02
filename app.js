const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const env = require('./env');
const logger = require('./logger');
const configurePassport = require('./passport');
const { sequelize } = require('./models');
const indexRouter = require('./routes/index');
const { errorHandler, error404 } = require('./middlewares/errorMiddleware');

// crons imports
const userCron = require('./crons/user');

// 채팅방
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
app.set('io', io);

app.use('/chattt', (req, res) => res.render('chatIndex'));
app.use('/chat/:moimId', (req, res) => res.render('chatIndex'));

const moimNamespace = io.of('/chat');
app.set('moimNamespace', moimNamespace);

let roomId = '';
// 특정 네임스페이스 지정시의 코드
moimNamespace.on('connection', (socketMoim) => {
  console.log('moim 네임스페이스 접속');
  // console.log("socketMoim", socketMoim);

  socketMoim.on('enterNewUser', async (userNickName, targetRoomId) => {
    socketMoim.name = userNickName;
    console.log('방 입장유저 닉네임', socketMoim.name);
    roomId = targetRoomId;
    socketMoim.join(roomId);
    const msg = `${userNickName}님이 채팅방에 참가했습니다.`;

    moimNamespace.to(roomId).emit('updateMsg', {
      name: 'SERVER',
      msg,
    });
  });

  socketMoim.on('leaveRoom', async (userNickName, targetRoomId) => {
    // 프론트로부터 전달 받은 roomId를 타겟으로 하여 방에서 leave시킨다
    socketMoim.leave(targetRoomId);

    const msg = `${userNickName}님이 퇴장하셨습니다`;
    console.log('퇴장 메세지', msg);

    moimNamespace.to(targetRoomId).emit('updateMsg', {
      name: 'SERVER',
      msg,
    });
  });

  socketMoim.on('enterNewRoom', async (newRoom, userNickName) => {
    // DB의 고유 roomId를 참고하여 방에 join시킨다
    console.log('newRoom', newRoom);
    const roomId = newRoom.id;

    socketMoim.join(roomId);
    const msg = `${userNickName}님이 채팅방에 참가했습니다.`;

    moimNamespace.to(roomId).emit('updateMsg', {
      name: 'SERVER',
      msg,
    });
  });

  socketMoim.on('sendMsg', async (userNickName, msg, FromProntRoomId) => {
    const targetRoomId = FromProntRoomId;

    moimNamespace.to(targetRoomId).emit('updateMsg', {
      name: userNickName,
      msg,
    });
  });

  socketMoim.on('disconnect', () => {
    const targetRoomId = roomId;
    socketMoim.leave(targetRoomId);

    console.log('디스커넥티드의 socketMoim.name', socketMoim.name);
    const msg = `${socketMoim.name}님이 퇴장하셨습니다`;

    moimNamespace.to(targetRoomId).emit('updateMsg', {
      name: 'SERVER',
      msg,
    });
  });
});

if (env.NODE_ENV === 'production') {
  app.use(
    helmet({
      frameguard: false,
      contentSecurityPolicy: false,
      hsts: false,
    }),
  );
  app.use(morgan('combined', { stream: logger.stream }));

  app.use(hpp());
} else {
  app.use(morgan('dev', { stream: logger.stream }));
}

sequelize
<<<<<<< HEAD
  .sync({ force: false })
=======
  .sync({ force: true }) //데이터 구조 변경하고 싶을 때, true
>>>>>>> feature/redis-test
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

app.use('/api', indexRouter);

app.use(error404);
app.use(errorHandler);

userCron.destroyUser();

module.exports = { httpServer, io };
