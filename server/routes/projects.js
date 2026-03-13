const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { auth, authorize } = require('../middleware/auth');

// All project routes require authentication
router.use(auth);

router.post('/', authorize('Admin', 'Project Coordinator'), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id/status', authorize('Admin', 'Project Coordinator', 'Installer'), projectController.updateProjectStatus);

module.exports = router;
