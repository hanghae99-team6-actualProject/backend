var express = require('express');
var router = express.Router();


//controller import
const routinesCtrl = require('../controllers/routinesCtrl');

routineGet = routinesCtrl.routineGet;
routineCreate = routinesCtrl.routineCreate;
routineModify = routinesCtrl.routineModify;
routineDelete = routinesCtrl.routineDelete;

//API
router.get('/users/routine/:userId', routineGet);
router.post('/users/routine/:userId', routineCreate);
router.put('/users/routine/:routineId', routineModify);
router.delete('/users/routine/:routineId', routineDelete);

module.exports = router;