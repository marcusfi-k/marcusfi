// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import modalReducer from './modalSlice';
import editPostReducer from './editPostSlice';
import contentReducer from './contentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    modal: modalReducer,
    editPost: editPostReducer,
    content: contentReducer,
  },
});

export default store;
