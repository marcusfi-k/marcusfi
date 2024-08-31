import axios from 'axios'; // Nhập thư viện axios để thực hiện các yêu cầu HTTP
import Cookies from 'js-cookie'; // Nhập thư viện js-cookie để quản lý cookie

const API_URL = process.env.REACT_APP_API_URL; // Lấy giá trị URL của API từ biến môi trường

const api = axios.create({
  baseURL: API_URL, // Đặt URL cơ bản cho các yêu cầu
  headers: {
    'Content-Type': 'application/json', // Thiết lập kiểu nội dung là JSON
  },
  withCredentials: true, // Bao gồm cookie trong các yêu cầu
});

const authApi = axios.create({
  baseURL: API_URL, // Đặt URL cơ bản cho các yêu cầu
  headers: {
    'Content-Type': 'application/json', // Thiết lập kiểu nội dung là JSON
  },
  withCredentials: true, // Bao gồm cookie trong các yêu cầu
});

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData); // Gửi yêu cầu đăng ký với dữ liệu người dùng
    return response.data; // Trả về dữ liệu từ phản hồi
  } catch (error) {
    console.error('Registration error:', error); // In lỗi ra console nếu có lỗi
    return { success: false, message: error.message }; // Trả về đối tượng thông báo lỗi
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials); // Gửi yêu cầu đăng nhập với thông tin xác thực
    const { user, accessToken, refreshToken } = response.data; // Lấy thông tin người dùng và token từ phản hồi

    // Chỉ giữ lại thông tin người dùng cần thiết
    const userInfo = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      email: user.email,
      profileImage: user.profileImage,
      backgroundImage: user.backgroundImage,
      createdAt: user.createdAt,
      role: user.role,
    };

    const secure = process.env.NODE_ENV === 'production'; // Kiểm tra nếu môi trường là production
    Cookies.set('mat', accessToken, { expires: 31 / 1440, sameSite: 'Strict', secure }); // Đặt cookie access token
    Cookies.set('mrt', refreshToken, { expires: 31, sameSite: 'Strict', secure }); // Đặt cookie refresh token

    return { user: userInfo, accessToken, refreshToken }; // Trả về thông tin người dùng và token
  } catch (error) {
    console.error('Login error:', error); // In lỗi ra console nếu có lỗi
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout'); // Gửi yêu cầu đăng xuất
    Cookies.remove('mat'); // Xóa cookie access token
    Cookies.remove('mrt'); // Xóa cookie refresh token
  } catch (error) {
    console.error('Logout error:', error); // In lỗi ra console nếu có lỗi
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('mrt'); // Lấy refresh token từ cookie
    if (!refreshToken) throw new Error('No refresh token available'); // Ném lỗi nếu không có refresh token

    const response = await api.post('/auth/refresh-token', { token: refreshToken }); // Gửi yêu cầu làm mới token với refresh token
    const { accessToken } = response.data; // Lấy access token từ phản hồi

    const secure = process.env.NODE_ENV === 'production'; // Kiểm tra nếu môi trường là production
    Cookies.set('mat', accessToken, { expires: 31 / 1440, sameSite: 'Strict', secure }); // Đặt cookie access token mới
    return accessToken; // Trả về access token mới
  } catch (error) {
    console.error('Refresh token error:', error); // In lỗi ra console nếu có lỗi
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
};

// Hàm lấy cookie
function getCookie(name) {
  const value = `; ${document.cookie}`; // Lấy toàn bộ cookie từ document
  const parts = value.split(`; ${name}=`); // Tách cookie theo tên
  if (parts.length === 2) return parts.pop().split(';').shift(); // Trả về giá trị cookie nếu tồn tại
}

// Hàm làm mới token
async function renewToken() {
  try {
    const success = await refreshToken(); // Gọi hàm refreshToken
    return success; // Trả về kết quả làm mới token
  } catch (error) {
    console.error('Error renewing token:', error); // In lỗi ra console nếu có lỗi
    return false; // Trả về false nếu làm mới token thất bại
  }
}

// Hàm kiểm tra và làm mới token
async function checkAndRenewToken() {
  const token = getCookie('mat'); // Lấy access token từ cookie
  if (!token) return; // Nếu không có token, thoát khỏi hàm

  const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã payload của JWT
  const exp = payload.exp * 1000; // Chuyển thời gian hết hạn từ giây sang milliseconds
  const now = Date.now(); // Lấy thời gian hiện tại

  // Nếu token đã hết hạn, thử làm mới token
  if ((exp - now) < 0) {
    for (let i = 0; i < 2; i++) { // Thử làm mới token tối đa 2 lần
      const success = await renewToken(); // Gọi hàm renewToken
      if (success) return; // Nếu làm mới thành công, thoát khỏi vòng lặp
      await new Promise(resolve => setTimeout(resolve, 2000)); // Đợi 2 giây trước khi thử lại
    }
    // Nếu làm mới không thành công sau 2 lần, thông báo người dùng
    alert('Your session has expired. Please save your work and login again.');
  }
}

// Gọi hàm checkAndRenewToken thường xuyên để kiểm tra token
setInterval(checkAndRenewToken, 60 * 1000); // Mỗi phút kiểm tra một lần

// Lắng nghe các sự kiện người dùng để kiểm tra và làm mới token
document.addEventListener('mousemove', checkAndRenewToken);
document.addEventListener('keydown', checkAndRenewToken);
document.addEventListener('click', checkAndRenewToken);

// Khởi chạy kiểm tra token ngay khi trang tải
checkAndRenewToken();

export { API_URL, api, authApi, checkAndRenewToken }; // Xuất các biến và hàm để sử dụng ở nơi khác
