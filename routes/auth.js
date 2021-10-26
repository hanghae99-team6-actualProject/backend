const express = require('express');
const { localSignup } = require('../controllers/localUser')
const router = express.Router();

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    req.logout()
    res.redirect('/')
  })
})


router.get("/debug", (req, res) => {
  res.json({
    "req.session": req.session,
    "req.user": req.user,

    // passport 정보를 들여다 보자
    "req._passport": req._passport,
  })
})

// router.get('/signup', localSignup)

module.exports = router;