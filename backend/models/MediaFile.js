const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class MediaFile extends Model {}

MediaFile.init({
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filepath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Contents', // 'Contents' là tên bảng trong cơ sở dữ liệu
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'MediaFile',
  tableName: 'MediaFiles', // Đảm bảo tên bảng là chính xác
  timestamps: true // Tự động thêm `createdAt` và `updatedAt`
});

module.exports = MediaFile;
