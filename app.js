const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.EXPRESS_PORT;
const { sequelize } = require("./models");

//routes imports
const indexRouter = require('./routes/index');
const sampleRouter = require('./routes/samples');
const routineRouter = require('./routes/user');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//routes
app.use('/api', indexRouter);
app.use('/api', sampleRouter);
app.use('/api', routineRouter);

sequelize
  .sync({ force: false }) //데이터 구조 변경하고 싶을 때, true
  .then(() => {
    console.log('------ SQL Restructure Complete ------');
  })
  .catch((error) => {
    console.error(error);
  });

app.get('/', async(req, res) => {
  res.render('index');
})

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});

module.exports = app;
