const Bookmark = require('../models/Bookmark');
const Content = require('../models/Content');
const User = require('../models/User');

exports.addBookmark = async (req, res, next) => {
  const { contentId } = req.body;

  try {
    const bookmark = await Bookmark.create({
      userId: req.user.id,
      contentId,
    });

    res.status(201).json({ bookmark });
  } catch (error) {
    next(error);
  }
};

exports.removeBookmark = async (req, res, next) => {
  const { contentId } = req.body;

  try {
    const bookmark = await Bookmark.findOne({
      where: { userId: req.user.id, contentId },
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    await bookmark.destroy();
    res.status(200).json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getBookmarksByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const bookmarks = await Bookmark.findAll({
      where: { userId },
      include: [
        {
          model: Content,
          include: [{ model: User, attributes: ['username', 'displayName', 'profileImage'] }],
        },
      ],
    });

    res.status(200).json(bookmarks);
  } catch (error) {
    next(error);
  }
};
