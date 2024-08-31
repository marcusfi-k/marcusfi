const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser } = require('../middleware/userMiddleware');
const { checkAndRefreshTokens } = require('../middleware/authMiddleware');

// Đăng ký
router.post('/register', validateUser, authController.register);

// Đăng nhập
router.post('/login', authController.login);

// Làm mới token
router.post('/refresh-token', authController.refreshToken);

// Đăng xuất
router.post('/logout', authController.logout);

module.exports = router;
