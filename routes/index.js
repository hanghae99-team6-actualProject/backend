var express = require('express');
var router = express.Router();

const routineRouter = require('./routines')
const mainRouter = require('./main')

router.use('/users', routineRouter)
router.use('/main', mainRouter)

// app.use("/api", sampleRouter);
// app.use("/api", routineRouter);
//test용 시작 view page

router.get("/", async (req, res) => {
  res.render("index");
});
//test용 끝

module.exports = router;
