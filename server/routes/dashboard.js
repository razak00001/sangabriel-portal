const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/stats', dashboardController.getStats);
router.get('/activity', dashboardController.getRecentActivity);
router.get('/recent-projects', dashboardController.getRecentProjects);
router.get('/archive-requests', dashboardController.getArchiveRequests);

module.exports = router;
