const {httpServer} = require('./app');
const env = require('./env');
const port = env.EXPRESS_PORT;
// const server = require('./socket');
const path = require('path');

// server.on('request', function(req, res) {
//   const moimId = 3;
//   if(req.method == "GET" && req.url == `/chat/${moimId}`) {
//     console.log("여기까지가끝인가보오")
//     return res.render('chatIndex');
//   }
// });

httpServer.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});


// app.listen(port, () => {
//   console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
// });