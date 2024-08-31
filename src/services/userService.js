import axios from 'axios'; // Import thư viện axios để gửi HTTP request
import { API_URL } from './authService'; // Import các hằng số từ file config

// Cập nhật hồ sơ người dùng
export const updateProfile = async (username, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${username}/profile`, userData, { withCredentials: true });
    return response.data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error; // Ném lỗi để xử lý ở chỗ gọi hàm
  }
};

// Thay đổi mật khẩu
export const changePassword = async (username, { currentPassword, newPassword }) => {
  try {
    const response = await axios.put(`${API_URL}/users/${username}/password`, { currentPassword, newPassword }, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUser = async (username, currentPassword) => {
  try {
    const response = await axios.delete(`${API_URL}/users/${username}`, {
      data: { currentPassword },
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
