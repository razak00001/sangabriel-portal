const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, authorize } = require('../middleware/auth');

// Get all users or filter by role
router.get('/', auth, authorize('Admin', 'Project Manager', 'Accounting'), userController.getUsersByRole);

// Get user statistics
router.get('/stats', auth, authorize('Admin', 'Project Manager'), userController.getUserStats);

// Get single user
router.get('/:id', auth, userController.getUserById);

// Update user
router.patch('/:id', auth, authorize('Admin'), userController.updateUser);

// Delete user
router.delete('/:id', auth, authorize('Admin'), userController.deleteUser);

// Toggle user status
router.patch('/:id/toggle-status', auth, authorize('Admin'), userController.toggleUserStatus);

module.exports = router;
