const logger = require('./logger');
const env = require('./env')
const {httpServer} = require('./app');
const port = env.EXPRESS_PORT;
// const server = require('./socket');
const path = require('path');

// 로거가 포함된 앱.리슨
// app.listen(port, () => {
//   logger.info(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
// });

httpServer.listen(port, () => {
  logger.info(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});
