const express = require('express');
const { register, login, me } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// router.get('/me', protect, me); // enabled in commit 4 once auth middleware exists

module.exports = router;