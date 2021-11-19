//일단 이거 안쓰고 프론트에서 스크립트 구역에서 사용함!


const io = require('socket.io-client');

console.log('여기 읽는다!!!');
// const socket = io('http://localhost:8080');
// const socket = io();


const moimId = window.location.href.split('/')[4];
const socketMoim = io(`http://localhost:8080/chat/${moimId}`);

// socket.on('connect', () => {
//   // 소켓 연결시!
//   var name = prompt('대화명을 입력해주세요.', '');
//   // console.log('입력한 대화명',name);

//   socket.emit('newUserEnter', name);
// });

// var chatWindow = document.getElementById('chatWindow');
// socket.on('updateMsg', function (data) {
//   //메세지 업데이트, 서버(관리자)와 유저의 내용이 if문을 통해 분기
//   // console.log('updateMsg의 데이터', data);

//   if (data.name === 'SERVER') {
//     //html의 info를 가져와서 변수에 넣는다
//     var infoContents = document.getElementById('info');

//     infoContents.innerHTML = data.msg;

//     //5초뒤에 인포의 html을 공란으로 만든다! 오호
//     setTimeout(() => {
//       info.innerHTML = '';
//     }, 5000);
//   } else {
//     //서버(관리자)가 보낸 것이 아니라면 채팅창에 고정 노출
//     var chatMsgData = drawChatMessage(data);
//     chatWindow.appendChild(chatMsgData);
//   }
// });

// function drawChatMessage(data) {
//   //챗팅메세지가 오면 클라이언트에 그려주는 역할을 하는 함수
//   var wrap = document.createElement('p');
//   var msg = document.createElement('span');
//   var name = document.createElement('span');

//   // 변수에 데이터를 담기
//   name.innerText = data.name; //데이터라는 변수 안에 저장한 name 을 텍스트로 넣는다
//   msg.innerText = data.msg; // 데이터라는 변수 안에 저장한 msg 을 텍스트로 넣는다

//   //데이터 값을 지닌 녀석들에게 클래스를 할당
//   name.classList.add('display_user_name');
//   msg.classList.add('display_user_msg');
//   wrap.classList.add('display_user');
//   wrap.dataset.id = socket.id; //데이터 셋의 아이디값으로 소켓의 고유값을 넣는다

//   // 지정된 모든 것을 어펜드 해준다
//   wrap.appendChild(name);
//   wrap.appendChild(msg);

//   return wrap;
// }

// var sendBtn = document.getElementById('chatMsgBtn'); //전송버튼의 변수화
// var chatInput = document.getElementById('chatInput'); //채팅장의 변수화

// sendBtn.addEventListener('click', function () {
//   //전송버튼을 눌렀을 때의 함수
//   var msg = chatInput.value;

//   if (!msg) return false;

//   //메세지 전달 이벤트 발생!
//   socket.emit('sendMsg', {
//     msg,
//   });

//   chatInput.value = ''; // 소켓.에밋으로 이벤트를 발생시켜 서버와 통신 후 메세지 인풋창을 공란으로 돌려 놓는다
// });

socketMoim.on('connect', () => {
  var name = prompt('네임스페이스에서 쓸 대화명을 입력해주세요.', '');

  socketMoim.emit('newUserEnter', name);
});

function drawChatMessage(data) {
  //챗팅메세지가 오면 클라이언트에 그려주는 역할을 하는 함수
  var wrap = document.createElement('p');
  var msg = document.createElement('span');
  var name = document.createElement('span');

  // 변수에 데이터를 담기
  name.innerText = data.name; //데이터라는 변수 안에 저장한 name 을 텍스트로 넣는다
  msg.innerText = data.msg; // 데이터라는 변수 안에 저장한 msg 을 텍스트로 넣는다

  //데이터 값을 지닌 녀석들에게 클래스를 할당
  name.classList.add('display_user_name');
  msg.classList.add('display_user_msg');
  wrap.classList.add('display_user');
  wrap.dataset.id = socketMoim.id; //데이터 셋의 아이디값으로 소켓의 고유값을 넣는다

  // 지정된 모든 것을 어펜드 해준다
  wrap.appendChild(name);
  wrap.appendChild(msg);

  return wrap;
}

var sendBtn = document.getElementById('chatMsgBtn'); //전송버튼의 변수화
var chatInput = document.getElementById('chatInput'); //채팅장의 변수화

var chatWindow = document.getElementById('chatWindow');
socketMoim.on('updateMsg', function (data) {
  //메세지 업데이트, 서버(관리자)와 유저의 내용이 if문을 통해 분기
  // console.log('updateMsg의 데이터', data);

  if (data.name === 'SERVER') {
    //html의 info를 가져와서 변수에 넣는다
    var infoContents = document.getElementById('info');

    infoContents.innerHTML = data.msg;

    //5초뒤에 인포의 html을 공란으로 만든다! 오호
    setTimeout(() => {
      info.innerHTML = '';
    }, 5000);
  } else {
    //서버(관리자)가 보낸 것이 아니라면 채팅창에 고정 노출
    var chatMsgData = drawChatMessage(data);
    chatWindow.appendChild(chatMsgData);
  }
});

sendBtn.addEventListener('click', function () {
  //전송버튼을 눌렀을 때의 함수
  var msg = chatInput.value;

  if (!msg) return false;

  //메세지 전달 이벤트 발생!
  socketMoim.emit('sendMsg', { msg });

  chatInput.value = ''; // 소켓.에밋으로 이벤트를 발생시켜 서버와 통신 후 메세지 인풋창을 공란으로 돌려 놓는다
});

socketMoim.on('newRoom', function (data) {
  console.log(data);
  console.log('새로운 채팅방에 대한 랜딩이 필요하다');
});
