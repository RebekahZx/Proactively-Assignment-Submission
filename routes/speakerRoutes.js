const express = require('express');
const { createSpeakerProfile, listSpeakers } = require('../controllers/speakerController');

const router = express.Router();

// Create or update speaker profile
router.post('/profile', createSpeakerProfile);

// List all speakers
router.get('/', listSpeakers);

module.exports = router;
