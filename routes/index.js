var express = require('express');
var router = express.Router();

const userRouter = require('./user');
const routineRouter = require('./routines')
const mainRouter = require('./main')

router.use('/users', userRouter)
router.use('/main', mainRouter)

// app.use("/api", sampleRouter);
// app.use("/api", routineRouter);
//test용 시작 view page

module.exports = router;