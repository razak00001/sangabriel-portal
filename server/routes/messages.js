const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { auth } = require('../middleware/auth');

router.get('/project/:projectId', auth, messageController.getProjectMessages);
router.post('/', auth, messageController.sendMessage);
router.patch('/project/:projectId/read', auth, messageController.markProjectMessagesAsRead);

module.exports = router;
