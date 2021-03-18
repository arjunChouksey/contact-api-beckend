const express = require('express');

const router = express.Router();

const statusControllers = require('../controllers/statusController');
const auth = require('../authrization/auth');

router.post('/reportPositive', auth, statusControllers.reportPostive);
router.post('/reportNegative', auth, statusControllers.reportNegative);

module.exports = router;
