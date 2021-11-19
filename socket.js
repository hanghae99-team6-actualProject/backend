// //채팅방용
// const express = require('express');
// const { app, server } = require('./app');
// const socketIo = require('socket.io');
// // const server = require('./server');

// const io = socketIo(server);
// // app.set('io', io);

// // app.use("io", io); //라우터에서 io 객체를 쓸 수 있게 하는 저장

// const moimId = 3;
// const moimNamespace = io.of(`/chat/${moimId}`);

// // io 기본 설정일 때의 코드
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

// //특정 네임스페이스 지정시의 코드
// moimNamespace.on('connection', (socketMoim) => {
//   console.log("====================================================")
//   console.log("moim 네임스페이스 접속");
//   console.log("socketMoim의 Id", socketMoim.id)
//   // console.log("socketMoim의 name", socketMoim.name)
//   // console.log("socketMoim의 name", socketMoim.roomId)
//   console.log("socketMoim의 name", socketMoim.nsp.name)
//   // console.log("socketMoim의 name", socketMoim.handshake.address)

//   const roomId = socketMoim.nsp.name;
//   socketMoim.join(roomId);

//   socketMoim.on('newUserEnter', (data) => {
//     // console.log("newUserEnter의 data", data);
//     // console.log("newUserEnter의 socket", sock);
//     // console.log("newUserEnter의 socket", sock.name);
//     socketMoim.name = data;

//     var msg = socketMoim.name + '님이 접속했습니다.';
//     // console.log('서버 입장시 메세지', msg);
//     console.log(msg);

//     moimNamespace.to(roomId).emit('updateMsg', { 
//       name: 'SERVER',
//       msg: msg,
//     });
//   });

//   socketMoim.on('sendMsg', function (data) {
//     // console.log('전송받은 data', data);
//     data.name = socketMoim.name; //소켓 연결시 저장시켰던 socket.name을 불러와서 데이터의 이름값으로 전달
//     // console.log('전송받은 것에 이름을 추가한 data', data);

//     console.log(data);

//     moimNamespace.emit('updateMsg', data);
//   });

//   socketMoim.on('disconnect', function () {
//     // console.log(sock.id, "연결이 끊어졌어요!");

//     var msg = socketMoim.name + '님이 퇴장하셨습니다';
//     // console.log('서버가 송출하는 퇴장 메세지', msg);
//     console.log(msg);

//     moimNamespace.to(roomId).emit('updateMsg', {
//       name: 'SERVER',
//       msg: msg,
//     });
//   });
// });

// module.exports = { server, io } ;