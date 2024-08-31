// Import thư viện `jsonwebtoken` để làm việc với JSON Web Tokens (JWT)
const jwt = require('jsonwebtoken');

// Import mô hình `User`, có khả năng đại diện cho người dùng trong cơ sở dữ liệu của bạn
const User = require('../models/User');

// Hàm tạo token truy cập (access token) cho người dùng
const createAccessToken = (user) => {
  // Ký một JWT mới với id và vai trò (role) của người dùng, sử dụng khóa bí mật và thời gian hết hạn từ biến môi trường
  return jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: process.env.ACCESS_TOKEN_LIFE });
};

// Hàm tạo token làm mới (refresh token) cho người dùng
const createRefreshToken = (user) => {
  // Ký một JWT mới chỉ với id của người dùng, sử dụng khóa bí mật khác và thời gian hết hạn từ biến môi trường
  return jwt.sign({ id: user.id }, process.env.REFRESH_SECRET_KEY, { expiresIn: process.env.REFRESH_TOKEN_LIFE });
};

// Hàm xác minh tính hợp lệ của token truy cập
const verifyAccessToken = (token) => {
  try {
    // Xác minh token bằng khóa bí mật và trả về token đã giải mã
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    // Ghi nhật ký lỗi và trả về null nếu token không hợp lệ
    console.error('Invalid access token:', error);
    return null;
  }
};

// Hàm xác minh tính hợp lệ của token làm mới
const verifyRefreshToken = (token) => {
  try {
    // Xác minh token bằng khóa bí mật làm mới và trả về token đã giải mã
    return jwt.verify(token, process.env.REFRESH_SECRET_KEY);
  } catch (error) {
    // Ghi nhật ký lỗi và trả về null nếu token không hợp lệ
    console.error('Invalid refresh token:', error);
    return null;
  }
};

// Middleware để bảo vệ các tuyến đường bằng cách yêu cầu token truy cập hợp lệ
const protect = (req, res, next) => {
  // Lấy token truy cập từ cookies của yêu cầu
  const token = req.cookies.mat;

  // Nếu không cung cấp token, trả về phản hồi 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  try {
    // Xác minh token truy cập
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      // Nếu token không hợp lệ, trả về phản hồi 401 Unauthorized
      return res.status(401).json({ message: 'Invalid access token' });
    }
    // Đính kèm token đã giải mã vào đối tượng yêu cầu và chuyển sang middleware tiếp theo
    req.user = decoded;
    next();
  } catch (error) {
    // Ghi nhật ký lỗi và trả về phản hồi 401 Unauthorized nếu có lỗi
    console.error('Error verifying access token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware để kiểm tra và làm mới token nếu cần thiết
const checkAndRefreshTokens = async (req, res, next) => {
  // Lấy URL gốc của yêu cầu
  const url = req.originalUrl;
  const accessToken = req.cookies.mat;
  const refreshToken = req.cookies.mrt;

  // Nếu có cung cấp token truy cập
  if (accessToken) {
    try {
      // Xác minh token truy cập
      const decodedAccessToken = verifyAccessToken(accessToken);
      if (decodedAccessToken) {
        // Đính kèm token đã giải mã vào đối tượng yêu cầu và chuyển sang middleware tiếp theo nếu token hợp lệ
        req.user = decodedAccessToken;
        return next();
      }
    } catch (error) {
      // Ghi nhật ký lỗi nếu có lỗi xác minh token truy cập
      console.error('Error verifying access token:', error);
    }
  }

  // Nếu có cung cấp token làm mới
  if (refreshToken) {
    try {
      // Xác minh token làm mới
      const decodedRefreshToken = verifyRefreshToken(refreshToken);
      if (decodedRefreshToken) {
        // Tìm người dùng trong cơ sở dữ liệu bằng id từ token làm mới
        const user = await User.findByPk(decodedRefreshToken.id);
        // Tạo token truy cập mới cho người dùng
        const newAccessToken = createAccessToken(user);
        // Đặt token truy cập mới vào cookies
        res.cookie('mat', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict' });
        // Đính kèm token làm mới đã giải mã vào đối tượng yêu cầu và chuyển sang middleware tiếp theo
        req.user = decodedRefreshToken;
        return next();
      }
    } catch (error) {
      // Ghi nhật ký lỗi nếu có lỗi làm mới token truy cập
      console.error('Error refreshing access token:', error);
    }
  }

  // Trả về phản hồi 401 Unauthorized nếu không cung cấp token hợp lệ
  return res.status(401).json({ message: 'Session expired, please login again' });
};

// Xuất các hàm và middleware để sử dụng trong các phần khác của ứng dụng
module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  protect,
  checkAndRefreshTokens,
};
