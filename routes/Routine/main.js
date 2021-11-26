var express = require('express');
var router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware')

//controller import
const mainCtrl = require('../../controllers/Routine/main');
getOngoing = mainCtrl.getOngoing;

//API
router.get('/ongoing', authMiddleware, getOngoing);

module.exports = router;