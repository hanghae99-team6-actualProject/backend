// 이 파일이 app.js와 소켓을 통해 통신하는 js를 담고있다.

'use strict';
var socket = io();
socket.on('connect', async (req, res, next) => {
  // try {
  //   console.log('프론트 javascript 진입');

  //   const userId = res.locals.user.id;
  //   socket.emit('newUserConnect', userId);

  // } catch(err) {

  // }

  var name = prompt('대화명을 입력해주세요.', '');
  console.log(name);



  socket.emit('newUserConnect', name);
});

var chatWindow = document.getElementById('chatWindow');
socket.on('updateMsg', function (data) {

  console.log('여기 데이터', data);
  console.log('여기 데이터의 메세지', data.msg);
  console.log('여기 데이터의 메세지', data.userId);

  if (data.name === 'SERVER') {

    //html의 info를 가져와서 변수에 넣는다
    var infoContents = document.getElementById('info');

    infoContents.innerHTML = data.msg;

    //5초뒤에 인포의 html을 공란으로 만든다! 오호
    setTimeout(() => {
      info.innerHTML = '';
    }, 5000);
  } else {
    var chatMsgData = drawChatMessage(data);
    chatWindow.appendChild(chatMsgData);
  }
});

function drawChatMessage(data) {
  var wrap = document.createElement('p');
  var msg = document.createElement('span');
  var name = document.createElement('span');

  // 변수에 데이터를 담기
  name.innerText = data.userId; //데이터라는 변수 안에 저장한 name 을 텍스트로 넣는다
  msg.innerText = data.msg; // 데이터라는 변수 안에 저장한 msg 을 텍스트로 넣는다

  //데이터 값을 지닌 녀석들에게 클래스를 할당
  name.classList.add('display_user_name');
  msg.classList.add('display_user_msg');
  wrap.classList.add('display_user');
  wrap.dataset.id = socket.id; //소켓의 고유값을 데이터 셋의 아이디값으로 넣는다

  // 지정된 모든 것을 어펜드 해준다
  wrap.appendChild(name);
  wrap.appendChild(msg);

  return wrap;
}

var sendBtn = document.getElementById('chatMsgBtn');
var chatInput = document.getElementById('chatInput');

sendBtn.addEventListener('click', async (req, res, next) => { //미들웨어 추가
  var msg = chatInput.value;

  if (!msg) return false;

  //메세지 전달 이벤트 발생!
  socket.emit('sendMsg', {
    msg,
  });

  chatInput.value = ''; // 메세지 인풋창을 공란으로 돌려 놓는다
});
