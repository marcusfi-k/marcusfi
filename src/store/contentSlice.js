// src/store/contentSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likes: [],
  comments: [],
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLikes: (state, action) => {
      state.likes = action.payload;
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
  },
});

export const { setLikes, setComments } = contentSlice.actions;
export default contentSlice.reducer;
