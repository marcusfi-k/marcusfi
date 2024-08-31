const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadMediaFile, deleteMediaFile } = require('../controllers/mediaFileController');

const router = express.Router();

router.post('/upload', protect, uploadMediaFile); // Route để upload ảnh
router.delete('/:id', protect, deleteMediaFile); // Route để xóa ảnh

module.exports = router;
