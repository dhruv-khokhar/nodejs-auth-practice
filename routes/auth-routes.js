const express = require('express');
// import controllers
const {registerUser, loginUser, changePassword} = require('../controllers/auth-controller');
// we need router here
const router = express.Router();
// protect the change-password route with authMiddleware - only authenticated users can change password
const authMiddleware = require('../middleware/auth-middleware')

// all routes are related to authentication and authorization
// mapping our routes to the controllers here
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/change-password', authMiddleware, changePassword);

// now use this router in server.js
module.exports = router;