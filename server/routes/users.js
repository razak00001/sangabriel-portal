const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, authorize('Admin', 'Project Manager'), userController.getUsersByRole);

module.exports = router;
