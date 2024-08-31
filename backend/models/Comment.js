const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Content = require('./Content');

const Comment = sequelize.define('Comment', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    }
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Content,
      key: 'id',
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Comment',
  timestamps: true,
});

User.hasMany(Comment, { foreignKey: 'userId' });
Content.hasMany(Comment, { foreignKey: 'contentId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Content, { foreignKey: 'contentId' });

module.exports = Comment;
