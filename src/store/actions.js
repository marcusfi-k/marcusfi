// src/store/actions.js
import { createAction } from '@reduxjs/toolkit';

// Action cho việc cập nhật tiêu đề
export const setTitle = createAction('editPost/setTitle');

// Action cho việc cập nhật mô tả
export const setDescription = createAction('editPost/setDescription');

// Action cho việc cập nhật loại nội dung
export const setType = createAction('editPost/setType');

// Action cho việc cập nhật URL
export const setUrl = createAction('editPost/setUrl');

// Action cho việc cập nhật danh mục
export const setCategories = createAction('editPost/setCategories');

export const setLikes = createAction('content/setLikes');
export const setComments = createAction('content/setComments');