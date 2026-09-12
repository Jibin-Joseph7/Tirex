const express = require('express');
const { protect } = require('../middleware/auth');
const {
  createAccount, getAccounts, getAccount, updateAccount, deleteAccount,
} = require('../controllers/accountController');

const router = express.Router();
router.use(protect);

router.route('/').get(getAccounts).post(createAccount);
router.route('/:id').get(getAccount).put(updateAccount).delete(deleteAccount);

module.exports = router;