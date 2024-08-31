const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    addBookmark,
    removeBookmark,
    getBookmarksByUserId
} = require('../controllers/bookmarkController');

const router = express.Router();

router.post('/', protect, addBookmark);
router.delete('/', protect, removeBookmark);
router.get('/user/:userId', protect, getBookmarksByUserId);

module.exports = router;
