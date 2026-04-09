const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, authorize } = require('../middleware/auth');

// All project routes require authentication
router.use(auth);

router.post('/', authorize('Admin', 'Project Manager'), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id/status', auth, authorize('Project Manager', 'Admin'), projectController.updateProjectStatus);
router.patch('/:id/assign-team', auth, authorize('Project Manager', 'Admin'), projectController.assignTeamMembers);
router.patch('/:id/toggle-milestone', auth, authorize('Project Manager', 'Admin'), projectController.toggleMilestone);

module.exports = router;
