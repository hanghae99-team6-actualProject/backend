var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

//controller import
const mainCtrl = require('../controllers/main');

getOngoing = mainCtrl.getOngoing;
getTrackerHistory = mainCtrl.getTrackerHistory;
getGraphHistory = mainCtrl.getGraphHistory

//API
router.get('/ongoing', authMiddleware, getOngoing);
router.get('/trackerHistory', authMiddleware, getTrackerHistory);
router.get('/graphHistory', authMiddleware, getGraphHistory);

module.exports = router;