var express = require('express');
var router = express.Router();

//test용 시작 view page

router.get("/", async (req, res) => {
  res.render("index");
});
//test용 끝

module.exports = router;
