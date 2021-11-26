var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware')
const historyCtrl = require('../controllers/History/history');

getTrackerHistory = historyCtrl.getTrackerHistory;
getGraphHistory = historyCtrl.getGraphHistory

//API
// router.get('/ongoing', authMiddleware, getOngoing);
router.get('/trackerHistory', authMiddleware, getTrackerHistory);
router.get('/graphHistory', authMiddleware, getGraphHistory);

module.exports = router;