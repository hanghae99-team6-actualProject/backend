var express = require('express');
var router = express.Router();

//test용 시작 view page

router.get("/", async (req, res) => {
  if (req.user) {
    res.send(`
    <h3>Login Success</h3>
        <a href="/logout">Logout</a>
        <p>
            ${JSON.stringify(req.user, null, 2)}
        </p>
    `)
  } else {
    res.send(`
      <h3>Node Passport Social Login</h3>
      <a href="/login/google">Login with Google+</a>
      <a href="/login/naver">Login with Naver</a>
      <a href="/login/kakao">Login with Kakao</a>
    `)
  }
});
//test용 끝

module.exports = router;
