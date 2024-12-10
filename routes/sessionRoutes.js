const express = require('express');
const { bookSession, listSessions } = require('../controllers/sessionController');
const checkTimeSlotAvailability = require('../middleware/checkTimeSlotAvailability');
const isLoggedin = require('../middleware/isLoggedin.js');

const router = express.Router();

// Book a session
router.post('/book',isLoggedin,checkTimeSlotAvailability,bookSession);



// List all sessions
router.get('/', listSessions);

module.exports = router;
