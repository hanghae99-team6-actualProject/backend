var express = require('express');
var router = express.Router();
const env = require('../env')

const authRouter = require("./auth");
const usersRouter = require("./users");
const routineRouter = require('./routines');
const mainRouter = require('./main');
const likeRouter = require('./like');
const moimRouter = require('./moim');

router.use('/main', mainRouter)
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/routines', routineRouter)
router.use('/moim/like', likeRouter)
router.use('/moim', moimRouter)

router.get("/", async (req, res, next) => {
  if (req.user) {
    res.send(`
    <h3>Login Success</h3>
        <a href="${env.END_POINT}/api/auth/logout">Logout </a>
        <p>
            ${JSON.stringify(req.user, null, 2)}
        </p>
    `)
  } else {
    res.send(`
      <h3>Node Passport Social Login</h3>  
      <a href="${env.END_POINT}/api/auth/google">Login with Google+</a>
      <a href="${env.END_POINT}/api/auth/naver">Login with Naver</a>
      <a href="${env.END_POINT}/api/auth/kakao">Login with Kakao</a>
    `)
  }
});
//test용 끝


module.exports = router;
