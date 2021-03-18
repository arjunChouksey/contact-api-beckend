const express = require('express');

const router = express.Router();

const contactControllers = require('../controllers/contactControllers');
const auth = require('../authrization/auth');

router.get('/getNames', auth, contactControllers.getNames);
router.post('/addContact', auth, contactControllers.addContact);
router.get('/getContacts', auth, contactControllers.getContacts);

module.exports = router;