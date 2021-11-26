const express = require('express');
const authMiddleware = require('../../middlewares/authMiddleware')
const { doneAction } = require('../../controllers/Routine/actions');

const router = express.Router();

// 액션(운동) 완료
router.put('/', authMiddleware, doneAction);

module.exports = router;