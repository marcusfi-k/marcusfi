const Like = require('../models/Like');
const Content = require('../models/Content');
const User = require('../models/User');

exports.toggleLikeContent = async (req, res, next) => {
  const { contentId } = req.body;

  try {
    // Kiểm tra xem người dùng đã like bài viết chưa
    const existingLike = await Like.findOne({
      where: {
        contentId,
        userId: req.user.id,
      }
    });

    if (existingLike) {
      // Nếu đã like, thì xóa like
      await existingLike.destroy();
      res.status(200).json({ message: 'Content unliked successfully' });
    } else {
      // Nếu chưa like, thì thêm mới like
      const like = await Like.create({
        contentId,
        userId: req.user.id,
      });

      res.status(201).json({ message: 'Content liked successfully', like });
    }
  } catch (error) {
    next(error);
  }
};

exports.getLikesByContent = async (req, res, next) => {
  const { contentId } = req.params;

  try {
    const likes = await Like.findAll({
      where: { contentId },
      include: [
        { model: User, attributes: ['username', 'displayName', 'profileImage'] },
        { model: Content, attributes: ['title'] }
      ]
    });

    res.status(200).json(likes);
  } catch (error) {
    next(error);
  }
};
