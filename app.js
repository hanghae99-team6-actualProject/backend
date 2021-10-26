const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.EXPRESS_PORT;
const { sequelize } = require("./models");


//sequelize
sequelize
  .sync({ force: false }) // 데이터 구조 바꿀 때만 true
  .then(() => {
    console.log('DB 생성 완료');
  })
  .catch((error) => {
    console.error(error);
  });

//routes imports
const indexRouter = require("./routes/index");
// const sampleRouter = require("./routes/samples");
// const routineRouter = require("./routes/routines");
// const mainRouter = require("./routes/main");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

//routes
app.use("/api", indexRouter);
// app.use("/api", sampleRouter);
// app.use("/api", routineRouter);
// app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});

module.exports = app;
