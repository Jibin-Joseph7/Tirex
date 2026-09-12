const express = require('express');
const { protect } = require('../middleware/auth');
const { createTransaction, getTransactions, deleteTransaction } = require('../controllers/transactionController');

const router = express.Router();
router.use(protect);

router.route('/').get(getTransactions).post(createTransaction);
router.route('/:id').delete(deleteTransaction);

module.exports = router;