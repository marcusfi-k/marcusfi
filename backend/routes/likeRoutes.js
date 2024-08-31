const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
    toggleLikeContent,
    getLikesByContent
} = require('../controllers/likeController');

const router = express.Router();

router.post('/like', protect, toggleLikeContent);
router.get('/:contentId/likes', getLikesByContent);

module.exports = router;
