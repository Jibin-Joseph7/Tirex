const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createInvestment, getInvestments, updateInvestment, deleteInvestment,
} = require('../controllers/investmentController');

const router = express.Router();
router.use(protect);

router.route('/').get(getInvestments).post(createInvestment);
router.route('/:id').put(updateInvestment).delete(deleteInvestment);

module.exports = router;