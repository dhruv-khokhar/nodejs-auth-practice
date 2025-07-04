// this file defines all routes that can be accessed by admin only

const express = require('express');
// to protect this admin page, we need 2 layers of protection - logged in (auth) and role-based authentication (another middleware)
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
const router = express.Router();

router.get('/welcome', authMiddleware, adminMiddleware, (req, res) => {
    res.json({
        message: "Welcome to the Admin Page"
    })
})

module.exports = router;