const bcrypt = require('bcryptjs'); // Nhập thư viện bcryptjs để băm và so sánh mật khẩu
const { body, validationResult } = require('express-validator'); // Nhập thư viện express-validator để xác thực dữ liệu đầu vào

// Mã băm và so sánh mật khẩu
const hashPassword = async (password, saltRounds = 12) => {
  return await bcrypt.hash(password, saltRounds); // Băm mật khẩu với số lần salt mặc định là 12
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword); // So sánh mật khẩu với mật khẩu đã băm
};

// Validators
const validateUser = [
  body('username').notEmpty().withMessage('Username is required'), // Kiểm tra username không được để trống
  body('email').isEmail().withMessage('Email is invalid'), // Kiểm tra email có định dạng hợp lệ
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'), // Kiểm tra password phải dài ít nhất 6 ký tự
  (req, res, next) => {
    const errors = validationResult(req); // Lấy các lỗi từ việc xác thực
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Trả về lỗi nếu có
    }
    next(); // Chuyển sang middleware tiếp theo nếu không có lỗi
  }
];

const validateUserUpdate = [
  body('displayName').optional().notEmpty().withMessage('Display name is required if provided'),
  body('email').optional().isEmail().withMessage('Email must be valid if provided'),
  body('profileImage').optional(),
  body('backgroundImage').optional(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'), // Kiểm tra mật khẩu hiện tại không được để trống
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'), // Kiểm tra mật khẩu mới phải dài ít nhất 6 ký tự
  (req, res, next) => {
    const errors = validationResult(req); // Lấy các lỗi từ việc xác thực
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Trả về lỗi nếu có
    }
    next(); // Chuyển sang middleware tiếp theo nếu không có lỗi
  }
];

module.exports = {
  hashPassword, // Xuất hàm băm mật khẩu
  comparePassword, // Xuất hàm so sánh mật khẩu
  validateUser, // Xuất middleware xác thực thông tin người dùng khi đăng ký
  validateUserUpdate, // Xuất middleware xác thực thông tin người dùng khi cập nhật
  validatePasswordChange // Xuất middleware xác thực thông tin khi người dùng thay đổi mật khẩu
};
