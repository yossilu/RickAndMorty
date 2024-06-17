const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies;
  const myjwt = cookies?.jwt;
  const authHeader  = req.headers['authorization'];
  // if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
  const token = authHeader?.split(' ')[1];
  if (!myjwt && !token) return res.sendStatus(401);
  // const token = authHeader.split(' ')[1];
  const contentBetween =  myjwt ? myjwt?.slice(2, -2) : authHeader?.split(' ')[1];
  
  try {
    jwt.verify(
      contentBetween, 
      process.env.JWT_SECRET,
      (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.user = decoded;
        req.role = decoded.roles;
        next();
      }
    );
  } catch (error) {
    console.log(error)
    res.status(401)
    throw new Error('Not authorized')
  }

  
})

const authorize = (...allowedRoles) => {
  
  return asyncHandler((req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.role[0])) {
      return res.status(403).json({message: 'You Are Not An Admin!'}); // Forbidden
    }
    next();
  });
};


module.exports = { protect, authorize }