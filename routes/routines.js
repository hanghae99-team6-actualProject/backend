var express = require('express');
var router = express.Router();


//controller import
const routinesCtrl = require('../controllers/routinesCtrl');

routineGet = routinesCtrl.routineGet;
routineCreate = routinesCtrl.routineCreate;
routineModify = routinesCtrl.routineModify;
routineDelete = routinesCtrl.routineDelete;

//API
router.get('/routine/:userId', routineGet);
router.post('/routine/:userId', routineCreate);
router.put('/routine/:routineId', routineModify);
router.delete('/routine/:routineId', routineDelete);

module.exports = router;