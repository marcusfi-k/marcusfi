const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Content = require('./Content');

const Bookmark = sequelize.define('Bookmark', {
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
  modelName: 'Bookmark',
  timestamps: true,
});

User.hasMany(Bookmark, { foreignKey: 'userId' });
Content.hasMany(Bookmark, { foreignKey: 'contentId' });
Bookmark.belongsTo(User, { foreignKey: 'userId' });
Bookmark.belongsTo(Content, { foreignKey: 'contentId' });

module.exports = Bookmark;
