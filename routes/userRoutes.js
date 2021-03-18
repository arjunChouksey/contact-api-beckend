const express = require('express');

const router = express.Router();

const userControllers = require('../controllers/userControllers');
const auth = require('../authrization/auth');

router.get('/get', userControllers.getUser);
router.post('/post', userControllers.validEmail, userControllers.postUser);
router.get('/user', auth, userControllers.aboutUser);

module.exports = router;