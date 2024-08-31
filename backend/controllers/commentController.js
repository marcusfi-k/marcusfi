const Comment = require('../models/Comment');

exports.createComment = async (req, res, next) => {
  const { content, contentId } = req.body;

  try {
    const comment = await Comment.create({
      content,
      contentId,
      userId: req.user.id,
    });
    res.status(201).json({ message: 'Comment created successfully', comment });
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByContentId = async (req, res, next) => {
  const { contentId } = req.params;

  try {
    const comments = await Comment.findAll({ where: { contentId } });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findOne({ where: { id, userId: req.user.id } });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or you are not the author' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findOne({ where: { id, userId: req.user.id } });

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or you are not the author' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
