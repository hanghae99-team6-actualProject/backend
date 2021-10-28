var express = require('express');
var router = express.Router();

//controller import
const { userTimer } = require('../controllers/timerCtrl');

//API
router.delete('/userTimer', userTimer);

module.exports = router;