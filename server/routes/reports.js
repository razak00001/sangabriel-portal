const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

// Only Admin can access reporting
router.get('/profitability/:projectId', authorize('Admin'), reportController.getProjectProfitability);
router.get('/performance', authorize('Admin'), reportController.getGlobalPerformance);
router.get('/revenue', authorize('Admin', 'Accounting'), reportController.getRevenueReport);
router.get('/workload', authorize('Admin'), reportController.getWorkloadDistribution);
router.get('/job-volume', authorize('Admin', 'Accounting'), reportController.getJobVolume);
router.get('/status-distribution', authorize('Admin', 'Accounting'), reportController.getStatusDistribution);

module.exports = router;
