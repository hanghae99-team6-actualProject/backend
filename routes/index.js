var express = require('express');
var router = express.Router();
const env = require('../env');

const authRouter = require("./auth");
const usersRouter = require("./users");
const routineRouter = require('./routines');
const mainRouter = require('./main');
const moimRouter = require('./moims');
const characterRouter = require('./characters');
const actionRouter = require('./actions');

router.use('/main', mainRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/routines', routineRouter);
router.use('/moims', moimRouter);
router.use('/characters', characterRouter);
router.use('/actions', actionRouter);

router.get("/", async (req, res, next) => {
  console.log('테스트용');
  if (req.user) {
    res.send(`
    <h3>Login Success</h3>
        <a href="${env.DOMAIN}/api/auth/logout">Logout </a>
        <p>
            ${JSON.stringify(req.user, null, 2)}
        </p>
    `)
  } else {
    res.send(`
      <h3>Node Passport Social Login</h3>  
      <a href="${env.DOMAIN}/api/auth/google">Login with Google+</a>
      <a href="${env.DOMAIN}/api/auth/naver">Login with Naver</a>
      <a href="${env.DOMAIN}/api/auth/kakao">Login with Kakao</a>
    `)
  }
});

module.exports = router;
