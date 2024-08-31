import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isRegisterModalVisible: false,
  isLoginModalVisible: false,
  isEditPostModalVisible: false, // Thêm trạng thái cho EditPostModal
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showRegisterModal: (state) => {
      state.isRegisterModalVisible = true;
      state.isLoginModalVisible = false;
    },
    showLoginModal: (state) => {
      state.isRegisterModalVisible = false;
      state.isLoginModalVisible = true;
    },
    hideModals: (state) => {
      state.isRegisterModalVisible = false;
      state.isLoginModalVisible = false;
      state.isEditPostModalVisible = false; // Ẩn EditPostModal
    },
    showEditPostModal: (state) => { // Thêm action để hiển thị EditPostModal
      state.isEditPostModalVisible = true;
    },
  },
});

export const { showRegisterModal, showLoginModal, hideModals, showEditPostModal } = modalSlice.actions;
export default modalSlice.reducer;
