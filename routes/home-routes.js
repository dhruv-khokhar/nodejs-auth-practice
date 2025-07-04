// this file defines all routes that can be accessed by any logged in user (includes admins)

const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');

// create router
const router = express.Router();

router.get('/welcome', authMiddleware, (req, res) => {  // home route
    // doing logic here only since pretty simple
    // we get the userInfo from the middleware and we need to pass it to the frontend so it can be rendered to the UI
    const { username, userId, role } = req.userInfo;
    res.json({
        message: "Welcome to Home Page",
        user: {
            _id: userId,
            username,
            role
        }
    });
});
// this route needs to be protected by a middleware so that it cant be accessed by a user who is not logged in
// in the above route, we can pass multiple handlers (as middlewares) which get executed in the same order
// eg: router.get('/welcome', handler1, handler2, (req, res) => {});
// so we protect this route using an auth middleware by passing it as a handler above -> if this handler is successful only then the next handler (or the callback in our case will run)

module.exports = router;