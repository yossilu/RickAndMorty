const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const excludeFields = ['isVerified', 'createdAt', 'updatedAt', 'password'];

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, role, referralCode } = req.body;
  
  try {
    if (!email || !password) {
      res.status(400).json({ message: 'Invalid email or password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() })

    console.log(userExists)

    if (userExists) {
      return res.status(409).json({ message: 'User with the same email exists.' });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPwd,
      roles: role === 'User' ? ['USER'] : ['ADMIN'],
    })

    if (user) {
      const accessToken = jwt.sign(
        {
          email: user.email,
          roles: user.roles
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      const refreshToken = jwt.sign(
        {
          email: user.email,
          roles: user.roles
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      user.refreshToken = refreshToken;

      const updatedUser = await User.findOneAndUpdate(
        { email: user.email },
        { refreshToken: refreshToken },
        { new: true }
      );

      let userObj = updatedUser ? updatedUser.toObject() : user;

      excludeFields.forEach(field => {
        delete userObj[field];
      });

      res.status(201).json({
        user: userObj
      });
    } else {
      res.status(400).json({ message: 'User creation failed' });
    }
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: 'Internal server error', err: err.message });
  }

})

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { password, email, isUser } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Both username and password are required!' });
    }

    const emailLowerCase = email.toLowerCase();
    const emailUpperCase = email.charAt(0).toUpperCase() + email.slice(1);
    const user = await User.findOne({ email: emailLowerCase });

    if (!user) {
      return res.status(401).json({ message: 'User not found!' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
      {
        email: user.email,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      {
        email: user.email,
        roles: user.roles
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    user.refreshToken = refreshToken;

    const updatedUser = await User.findOneAndUpdate(
      { email: user.email },
      { refreshToken: refreshToken },
      { new: true }
    );

    let userObj = updatedUser ? updatedUser.toObject() : user;

    excludeFields.forEach(field => {
      delete userObj[field];
    });

    res.json({
      user: userObj
    });

  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content

  try {
    const refreshToken = cookies.jwt;
    // Is refreshToken in db?
    const user = await User.findOne({ refreshToken });

    // Check if user is found
    if (!user) {
      res.clearCookie('jwt');
      return res.status(204).json({ message: "user logged out" });
    }

    const id = user._id;
    const result = await User.updateOne({ _id: id }, { refreshToken: '' }, { upsert: true });
    if (result.acknowledged && user) {
      res.clearCookie('jwt');
      res.status(204).json({ message: "user logged out" });
    }
  } catch (err) {
    return res.status(500).json({ message: "user logged out" });
  }
});


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
}