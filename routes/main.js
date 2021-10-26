var express = require('express');
var router = express.Router();

//controller import
const mainCtrl = require('../controllers/mainCtrl');

ongoingGet = mainCtrl.ongoingGet;
historyGet = mainCtrl.historyGet;

//API
router.get('/ongoing', ongoingGet);
router.get('/history', historyGet);

module.exports = router;