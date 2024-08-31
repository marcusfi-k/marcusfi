const { validateUserUpdate, validatePasswordChange, hashPassword, comparePassword } = require('../middleware/userMiddleware'); 
const User = require('../models/User'); 

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { username: req.params.username } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = [
  validateUserUpdate,
  async (req, res, next) => {
    try {
      const { displayName, email, profileImage, backgroundImage } = req.body;
      const updateData = { displayName, email, profileImage, backgroundImage };

      const [updatedRows] = await User.update(updateData, { where: { username: req.params.username } });
      if (updatedRows === 0) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      const updatedUser = await User.findOne({ where: { username: req.params.username } });
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
];

exports.changePassword = [
  validatePasswordChange,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findOne({ where: { username: req.params.username } });

      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }

      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        const error = new Error('Current password is incorrect');
        error.statusCode = 401;
        throw error;
      }

      const hashedNewPassword = await hashPassword(newPassword);
      await User.update({ password: hashedNewPassword }, { where: { username: req.params.username } });

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }
];

exports.deleteUser = async (req, res, next) => {
  try {
    const { currentPassword } = req.body;
    const user = await User.findOne({ where: { username: req.params.username } });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }

    await User.destroy({ where: { username: req.params.username } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
