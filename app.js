const express = require("express");
const cors = require("cors");
const session = require('express-session');
const morgan = require('morgan');
const hpp = require('hpp');
const helmet = require('helmet');
const env = require('./env')

const configurePassport = require('./passport')
const { sequelize } = require("./models");
//routes imports
const indexRouter = require("./routes/index");

const port = env.EXPRESS_PORT;
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

const sessionOption = {
  secret: 'SESSION_SECRET',
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false
  }
};
if (env.NODE_ENV === 'production') {
  console.log('배포 환경입니다');
  // proxy 서버를 사용한다면 true값을 주자.
  // sessionOption.proxy = true;
  // Secure는 https로 통신하는 경우만 웹브라우저가 쿠키를 서버로 전송하는 옵션입니다.
  // 여기서는 https를 사용하지 않으므로 주석 처리합니다.
  // sessionOption.cookie.secure = true;
}
app.use(
  session(sessionOption)
);

configurePassport(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

//routes
app.use('/api', indexRouter);

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});

module.exports = app;