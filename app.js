const express = require("express");
const cors = require("cors");
const session = require('express-session');
const morgan = require('morgan');
const dotenv = require("dotenv");
dotenv.config();
const configurePassport = require('./passport')
const { sequelize } = require("./models");

//routes imports
const indexRouter = require("./routes/index");

const app = express()
const port = process.env.EXPRESS_PORT;

app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

sequelize
  .sync({ force: false }) //데이터 구조 변경하고 싶을 때, true
  .then(() => {
    console.log('------ SQL Restructure Complete ------');
  })
  .catch((error) => {
    console.error(error);
  });

app.use(
  session({
    secret: 'SESSION_SECRET',
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    resave: false,
    saveUninitialized: true,
  })
)
configurePassport(app);

//routes
app.use('/api', indexRouter);

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});

module.exports = app;