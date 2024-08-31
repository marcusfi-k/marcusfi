const sequelize = require('../config/db'); // Thêm dòng này
const Content = require('../models/Content');
const MediaFile = require('../models/MediaFile');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

exports.createContent = async (req, res, next) => {
  const { title, description, type, url, categories } = req.body;

  try {
    console.log('Received data:', req.body);

    const slug = createSlug(title);

    const content = await Content.create({
      title,
      description,
      type,
      authorId: req.user.id,
      categories,
      slug,
      url // Lưu URL ảnh đại diện vào cột url
    });

    res.status(201).json({ message: 'Content created successfully', content });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    next(error);
  }
};

const createSlug = (title) => {
  const from = "áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
  const newTitle = title.split('').map((char, i) => {
    const index = from.indexOf(char);
    return index >= 0 ? to[index] : char;
  }).join('');

  return newTitle
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

exports.getAllContents = async (req, res, next) => {
  try {
    const contents = await Content.findAll({
      include: [
        { model: User, attributes: ['username', 'displayName', 'profileImage'] },
        { model: MediaFile, as: 'mediaFiles' },
        { model: Like },
        { model: Comment, include: [{ model: User, attributes: ['username', 'displayName', 'profileImage'] }] }
      ]
    });
    res.status(200).json(contents);
  } catch (error) {
    console.error('Error getting contents:', error);
    next(error);
  }
};

exports.getContentById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const content = await Content.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['username', 'displayName', 'profileImage'] },
        { model: MediaFile, as: 'mediaFiles' },
        { model: Like },
        { model: Comment, include: [{ model: User, attributes: ['username', 'displayName', 'profileImage'] }] }
      ]
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

exports.getContentBySlug = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const content = await Content.findOne({
      where: { slug },
      include: [
        { model: User, attributes: ['username', 'displayName', 'profileImage'] },
        { model: MediaFile, as: 'mediaFiles' },
        { model: Like },
        { model: Comment, include: [{ model: User, attributes: ['username', 'displayName', 'profileImage'] }] }
      ]
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json(content);
  } catch (error) {
    next(error);
  }
};

exports.updateContent = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, url, categories } = req.body;

  try {
    const content = await Content.findOne({ where: { id, authorId: req.user.id } });

    if (!content) {
      return res.status(404).json({ message: 'Content not found or you are not the author' });
    }

    content.title = title || content.title;
    content.description = description || content.description;
    content.url = url || content.url;
    content.categories = categories || content.categories;
    await content.save();

    res.status(200).json({ message: 'Content updated successfully', content });
  } catch (error) {
    next(error);
  }
};

exports.deleteContent = async (req, res, next) => {
  const { id } = req.params;

  try {
    const content = await Content.findOne({ where: { id, authorId: req.user.id } });

    if (!content) {
      return res.status(404).json({ message: 'Content not found or you are not the author' });
    }

    await content.destroy();
    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.checkSlug = async (req, res, next) => {
  const { slug } = req.body;

  try {
    const content = await Content.findOne({ where: { slug } });
    const isUnique = !content;
    res.status(200).json(isUnique);
  } catch (error) {
    next(error);
  }
};

exports.incrementViews = async (req, res, next) => {
  const { id } = req.params;

  try {
    const content = await Content.findByPk(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    content.views = (content.views || 0) + 1;
    await content.save();

    res.status(200).json({ message: 'Views incremented successfully', views: content.views });
  } catch (error) {
    next(error);
  }
};

exports.getTopLikedPosts = async (req, res, next) => {
  try {
    const topLikedPosts = await Content.findAll({
      include: [
        { model: User, attributes: ['username', 'displayName', 'profileImage'] },
        { model: MediaFile, as: 'mediaFiles' },
        { model: Comment, include: [{ model: User, attributes: ['username', 'displayName', 'profileImage'] }] }
      ],
      attributes: {
        include: [
          [sequelize.literal('(SELECT COUNT(*) FROM Likes WHERE Likes.contentId = Content.id)'), 'likeCount']
        ]
      },
      order: [[sequelize.literal('likeCount'), 'DESC']],
      limit: 5
    });

    res.status(200).json(topLikedPosts);
  } catch (error) {
    next(error);
  }
};
