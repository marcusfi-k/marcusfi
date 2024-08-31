const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createContent,
  getAllContents,
  getContentById,
  getContentBySlug,
  updateContent,
  deleteContent,
  checkSlug,
  incrementViews,
  getTopLikedPosts // Thêm dòng này
} = require('../controllers/contentController');

const router = express.Router();

router.post('/', protect, createContent);
router.get('/', getAllContents);
router.get('/:id', getContentById);
router.get('/slug/:slug', getContentBySlug);
router.put('/:id', protect, updateContent);
router.delete('/:id', protect, deleteContent);
router.post('/check-slug', checkSlug);
router.post('/:id/views', incrementViews);
router.get('/top/liked', getTopLikedPosts); // Thêm dòng này

module.exports = router;
