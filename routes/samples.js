var express = require('express');
var router = express.Router();

//controller import
const samplesCtrl = require('../controllers/samplesCtrl');

sampleFn = samplesCtrl.sampleFn;

//API
router.get('/sample', sampleFn);

module.exports = router;