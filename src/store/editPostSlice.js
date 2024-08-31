// src/store/editPostSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  description: '',
  type: 'post',
  url: '',
  categories: [],
};

const editPostSlice = createSlice({
  name: 'editPost',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setUrl: (state, action) => {
      state.url = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setTitle, setDescription, setType, setUrl, setCategories } = editPostSlice.actions;
export default editPostSlice.reducer;
