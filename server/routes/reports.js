const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

// Only Admin can access reporting
router.get('/job-volume', authorize('Admin'), reportController.getJobVolume);
router.get('/status-distribution', authorize('Admin'), reportController.getStatusDistribution);
router.get('/user-activity', authorize('Admin'), reportController.getUserActivity);

module.exports = router;
