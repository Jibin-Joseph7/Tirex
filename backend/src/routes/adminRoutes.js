const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  listUsers, updateUserRole, deactivateUser, platformStats,
} = require('../controllers/adminController');

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/users', listUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/deactivate', deactivateUser);
router.get('/stats', platformStats);

module.exports = router;