var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const mainCtrl = require('../controllers/main');

ongoingGet = mainCtrl.ongoingGet;
trackerHistoryGet = mainCtrl.trackerHistoryGet;
graphHistoryGet = mainCtrl.graphHistoryGet

//API
router.get('/ongoing', authMiddleware, ongoingGet);
router.get('/trackerHistory', authMiddleware, trackerHistoryGet);
router.get('/graphHistory', authMiddleware, graphHistoryGet);

module.exports = router;