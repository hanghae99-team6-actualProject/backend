const logger = require('./logger');
const env = require('./env');
const { httpServer } = require('./app');

const port = env.EXPRESS_PORT;

httpServer.listen(port, () => {
  logger.info(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});
