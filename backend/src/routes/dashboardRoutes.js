const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getSummary, getSpendingByCategory, getMonthlyTrend,
} = require('../controllers/dashboardController');

const router = express.Router();
router.use(protect);

router.get('/summary', getSummary);
router.get('/spending-by-category', getSpendingByCategory);
router.get('/monthly-trend', getMonthlyTrend);

module.exports = router;