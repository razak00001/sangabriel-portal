const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');
const { auth, authorize } = require('../middleware/auth');

router.use(auth);

// Admins can manage rates
router.post('/', authorize('Admin'), rateController.updateRates);

// Admin and Accounting can view rates
router.get('/', authorize('Admin', 'Accounting'), rateController.getRates);

module.exports = router;
