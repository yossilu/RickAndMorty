const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/userController.js')

const { handleRefreshToken } = require('../controllers/refreshTokenController.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/refresh', handleRefreshToken)
router.get('/logout', logoutUser);


module.exports = router