const express = require("express");
const cors = require("cors");
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const env = require('./env')

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

module.exports = app;