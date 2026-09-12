const express = require('express');
const { protect } = require('../middleware/auth');
const { exportPDF, exportExcel } = require('../controllers/reportController');

const router = express.Router();
router.use(protect);

router.get('/pdf', exportPDF);
router.get('/excel', exportExcel);

module.exports = router;