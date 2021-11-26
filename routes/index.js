var express = require('express');
var router = express.Router();
const env = require('../env');

//auth
const authRouter = require("./Auth/auth");

//user
const usersRouter = require("./User/users");

//character
const characterRouter = require('./Character/characters');

//moim
const chatRouter = require('./Moim/chat');
const commentsRouter = require('./Moim/comments');
const likesRouter = require('./Moim/likes');
const moimsRouter = require('./Moim/moims');
const noticeRouter = require('./Moim/notice');

//routine
const actionsRouter = require('./Routine/actions');
const routinesRouter = require('./Routine/routines');
const mainRouter = require('./Routine/main');

//auth router use
router.use('/auth', authRouter);

//user router use
router.use('/users', usersRouter);

//character router use
router.use('/characters', characterRouter);

//moim router use
router.use('/moims', chatRouter);
router.use('/moims', commentsRouter);
router.use('/moims', likesRouter);
router.use('/moims', moimsRouter);
router.use('/moims', noticeRouter);

//routine router use
router.use('/actions', actionsRouter);
router.use('/routines', routinesRouter);
router.use('/main', mainRouter);

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
