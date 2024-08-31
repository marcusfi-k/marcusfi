// src/store/selectors.js

// Selector để lấy tiêu đề
export const selectTitle = state => state.editPost.title;

// Selector để lấy mô tả
export const selectDescription = state => state.editPost.description;

// Selector để lấy loại nội dung
export const selectType = state => state.editPost.type;

// Selector để lấy URL
export const selectUrl = state => state.editPost.url;

// Selector để lấy danh mục
export const selectCategories = state => state.editPost.categories;
