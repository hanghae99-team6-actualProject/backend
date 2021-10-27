var express = require('express');
var router = express.Router();
const authRouter = require("./auth");
const usersRouter = require("./users");


router.use('/auth', authRouter);
router.use('/users', usersRouter);

const userRouter = require('./user');
const routineRouter = require('./routines')
const mainRouter = require('./main')

router.use('/users', userRouter)
router.use('/main', mainRouter)

router.get("/", async (req, res) => {
  if (req.user) {
    res.send(`
    <h3>Login Success</h3>
        <a href="/api/logout">Logout</a>
        <p>
            ${JSON.stringify(req.user, null, 2)}
        </p>
    `)
  } else {
    res.send(`
      <h3>Node Passport Social Login</h3>
      <a href="/api/auth/google">Login with Google+</a>
      <a href="/api/auth/naver">Login with Naver</a>
      <a href="/api/auth/kakao">Login with Kakao</a>
    `)
  }
});
//test용 끝


module.exports = router;
