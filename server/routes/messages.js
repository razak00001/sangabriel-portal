const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

router.get('/project/:projectId', auth, messageController.getProjectMessages);

module.exports = router;
