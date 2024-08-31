const express = require('express');
const { getUser, updateProfile, changePassword, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Route lấy thông tin người dùng (bảo vệ)
router.get('/:username', getUser);

// Route cập nhật hồ sơ người dùng (bảo vệ)
router.put('/:username/profile', protect, updateProfile);

// Route thay đổi mật khẩu người dùng (bảo vệ)
router.put('/:username/password', protect, changePassword);

// Route xóa người dùng (bảo vệ)
router.delete('/:username', protect, deleteUser);

module.exports = router;
