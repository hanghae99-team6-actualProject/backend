const app = require('./app');
const env = require('./env');
const port = env.EXPRESS_PORT;
const server = require('./socket');

// //채팅방용
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const server = http.createServer(app);
// const io = socketIo(server);

// io.on('connection', (sock) => {
//   console.log('새로운 소켓이 연결됐어요!');

//   sock.on('newUserEnter', (data) => {
//     // console.log("newUserEnter의 data", data);
//     // console.log("newUserEnter의 socket", sock);
//     // console.log("newUserEnter의 socket", sock.name);
//     sock.name = data;

//     var msg = sock.name + '님이 접속했습니다.';
//     // console.log('서버 입장시 메세지', msg);
//     console.log(msg);

//     io.sockets.emit('updateMsg', {
//       name: 'SERVER',
//       msg: msg,
//     });
//   });

//   sock.on('sendMsg', function (data) {
//     // console.log('전송받은 data', data);
//     data.name = sock.name; //소켓 연결시 저장시켰던 socket.name을 불러와서 데이터의 이름값으로 전달
//     // console.log('전송받은 것에 이름을 추가한 data', data);
//     io.sockets.emit('updateMsg', data);
//   });

//   sock.on('disconnect', function () {
//     // console.log(sock.id, "연결이 끊어졌어요!");

//     var msg = sock.name + '님이 퇴장하셨습니다';
//     // console.log('서버가 송출하는 퇴장 메세지', msg);
//     console.log(msg);

//     sock.broadcast.emit('updateMsg', {
//       name: 'SERVER',
//       msg: msg,
//     });
//   });
// });

server.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});


// app.listen(port, () => {
//   console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
// });

// module.exports = server;