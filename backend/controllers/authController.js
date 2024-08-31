const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../middleware/authMiddleware'); 
const { validateUser, hashPassword, comparePassword } = require('../middleware/userMiddleware'); 
const User = require('../models/User'); 

exports.register = [
  validateUser,
  async (req, res, next) => {
    const { username, displayName, phoneNumber, email, password } = req.body;
    console.log('Registering user:', req.body);
    try {
      const existingUser = await User.findOne({ where: { username } }) || await User.findOne({ where: { email } });
      if (existingUser) {
        const error = new Error('Username or email already exists');
        error.statusCode = 400;
        throw error;
      }

      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        username,
        displayName,
        phoneNumber,
        email,
        password: hashedPassword,
      });

      const accessToken = createAccessToken(user);
      const refreshToken = createRefreshToken(user);

      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('mat', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });
      res.cookie('mrt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
      });

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          email: user.email
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  }
];

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  console.log('Login attempt:', req.body);
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('mat', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });
    res.cookie('mrt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    console.log('Login successful for user:', username);
    res.status(200).json({ message: 'Login successful', user, accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { mrt } = req.cookies; 
  if (!mrt) {
    const error = new Error('No refresh token provided'); 
    error.statusCode = 401;
    return next(error);
  }

  try {
    const user = await User.findOne({ where: { refreshToken: mrt } }); 
    if (!user) {
      const error = new Error('Invalid refresh token'); 
      error.statusCode = 403;
      return next(error);
    }

    const isValid = verifyRefreshToken(mrt); 
    if (!isValid) {
      const error = new Error('Invalid or expired refresh token'); 
      error.statusCode = 403;
      return next(error);
    }

    const newAccessToken = createAccessToken(user); 
    const newRefreshToken = createRefreshToken(user); 

    user.refreshToken = newRefreshToken; 
    await user.save();

    res.cookie('mat', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    }); 
    res.cookie('mrt', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    }); 

    res.status(200).json({ message: 'Token refreshed successfully', accessToken: newAccessToken }); 
  } catch (error) {
    console.error('Refresh token error:', error);
    next(error); 
  }
};

exports.logout = async (req, res, next) => {
  const { mat } = req.cookies; 
  if (!mat) {
    const error = new Error('No refresh token provided'); 
    error.statusCode = 401;
    return next(error);
  }

  try {
    const user = await User.findOne({ where: { refreshToken: mat } }); 
    if (user) {
      user.refreshToken = null; 
      await user.save();
    }

    res.clearCookie('mat', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    }); 
    res.clearCookie('mrt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    }); 

    res.status(200).json({ message: 'Logout successful' }); 
  } catch (error) {
    console.error('Logout error:', error); 
    next(error); 
  }
};
