import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; // Import các hàm từ Redux Toolkit để tạo slice và async thunk
import axios from 'axios'; // Import thư viện axios để gửi HTTP request

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('user') || 'null'), // Kiểm tra và xử lý giá trị trước khi gọi JSON.parse
  isLoading: false, // Trạng thái đang tải, mặc định là false
  isError: false, // Trạng thái lỗi, mặc định là false
};

export const fetchUser = createAsyncThunk('user/fetchUser', async (username) => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${username}`, { withCredentials: true }); // Gửi HTTP GET request để lấy thông tin người dùng, kèm theo cookies
  return response.data; // Trả về dữ liệu từ server
});

export const updateUser = createAsyncThunk('user/updateUser', async (userData) => {
  const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, userData, { withCredentials: true }); // Gửi HTTP PUT request để cập nhật thông tin người dùng, kèm theo cookies
  return response.data; // Trả về dữ liệu từ server
});

const userSlice = createSlice({
  name: 'user', // Tên của slice
  initialState, // Trạng thái ban đầu của slice
  reducers: {
    setUser(state, action) {
      state.currentUser = action.payload; // Cập nhật thông tin người dùng trong state
      localStorage.setItem('user', JSON.stringify(action.payload)); // Lưu thông tin người dùng vào localStorage
    },
    logoutUser(state) {
      state.currentUser = null; // Xóa thông tin người dùng trong state
      localStorage.removeItem('user'); // Xóa thông tin người dùng trong localStorage
      localStorage.removeItem('token'); // Xóa token trong localStorage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true; // Đặt trạng thái đang tải là true khi fetchUser đang pending
        state.isError = false; // Đặt trạng thái lỗi là false
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.currentUser = action.payload; // Cập nhật thông tin người dùng trong state khi fetchUser thành công
        state.isLoading = false; // Đặt trạng thái đang tải là false
        localStorage.setItem('user', JSON.stringify(action.payload)); // Lưu thông tin người dùng vào localStorage
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false; // Đặt trạng thái đang tải là false khi fetchUser bị từ chối
        state.isError = true; // Đặt trạng thái lỗi là true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.currentUser = action.payload; // Cập nhật thông tin người dùng trong state khi updateUser thành công
        localStorage.setItem('user', JSON.stringify(action.payload)); // Lưu thông tin người dùng vào localStorage
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions; // Export các action để sử dụng trong các component

export default userSlice.reducer; // Export reducer để sử dụng trong store
