const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

// Only Admin can access reporting
router.get('/profitability/:projectId', authorize('Admin'), reportController.getProjectProfitability);
router.get('/performance', authorize('Admin'), reportController.getGlobalPerformance);

module.exports = router;
