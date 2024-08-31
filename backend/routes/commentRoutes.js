const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createComment,
  getCommentsByContentId,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router();

router.post('/', protect, createComment);
router.get('/:contentId', getCommentsByContentId);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
