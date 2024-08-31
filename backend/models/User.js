const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://firebasestorage.googleapis.com/v0/b/marcusfi.appspot.com/o/avatar_marcusfi.png?alt=media&token=5120a15b-8828-4164-ba87-1bae42dca9c4',
  },
  backgroundImage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://firebasestorage.googleapis.com/v0/b/marcusfi.appspot.com/o/backgroundImages%2Fmarcusfi_background_default_900_300.png?alt=media&token=2dd4f852-1dfe-456e-933c-ec72be8a3842',
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user',
  },
});

module.exports = User;
