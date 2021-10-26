var express = require('express');
var router = express.Router();
const routineRouter = require('./user');

router.use('/users', routineRouter);

module.exports = router;