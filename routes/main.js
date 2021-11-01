var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const mainCtrl = require('../controllers/main');

ongoingGet = mainCtrl.ongoingGet;
historyGet = mainCtrl.historyGet;

//API
router.get('/ongoing', authMiddleware, ongoingGet);
router.get('/history', authMiddleware, historyGet);

module.exports = router;