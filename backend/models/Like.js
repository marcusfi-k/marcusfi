const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Content = require('./Content');

const Like = sequelize.define('Like', {
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
  modelName: 'Like',
  timestamps: true,
});

User.hasMany(Like, { foreignKey: 'userId' });
Content.hasMany(Like, { foreignKey: 'contentId' });
Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Content, { foreignKey: 'contentId' });

module.exports = Like;
