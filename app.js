const express = require("express");
const cors = require("cors");
const session = require('express-session');
const dotenv = require("dotenv");
dotenv.config();
const configurePassport = require('./passport')

const { sequelize } = require("./models");


const app = express();

const port = process.env.EXPRESS_PORT;

//routes imports
const indexRouter = require("./routes/index");
const sampleRouter = require("./routes/samples");
const loginRouter = require('./routes/login')
const authRouter = require('./routes/auth')


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static("public"));

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

sequelize
  .sync({ force: true })
  .then(() => {
    console.log(`
    🐣 🐣 🐣 🐣 🐣 🐣 🐣
    🐤 안 녕 🐤 디 비 🐤 
    🐥 🐥 🐥 🐥 🐥 🐥 🐥
    `);
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
app.use("/", indexRouter);
app.use("/api", sampleRouter);

app.use("/login", loginRouter);
app.use('/', authRouter);

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 정상적으로 가동되었습니다.`);
});

module.exports = app;
