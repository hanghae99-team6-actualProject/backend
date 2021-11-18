const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const env = require('./env');
const logger = require('./logger');

const configurePassport = require('./passport')
const { sequelize } = require("./models");
//routes imports
const indexRouter = require("./routes/index");
const { errorHandler, error404, asyncErrorHandeler } = require('./middlewares/errorMiddleware');

//crons imports
const userCron = require("./crons/user");

//서버리슨 분리로 주석처리
// const port = env.EXPRESS_PORT;
const app = express()

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
  app.use(morgan('combined',{stream: logger.stream}));

  app.use(hpp());
} else {
  // app.use(morgan('dev'))
  app.use(morgan('dev',{stream: logger.stream}))
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

module.exports = app;