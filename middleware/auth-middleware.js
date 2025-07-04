// to protect certain routes (welcome route in this case) so that it cant be accessed by a user who is not logged in

// for decoding we need the token - specifically to verify the token
const jwt = require('jsonwebtoken');

// route protection
const authMiddleware = (req, res, next) => {
    // 1. check for token

    // get auth header (which has the bearer token) for authentication
    const authHeader = req.headers['authorization'];
    console.log(authHeader); // this givers 'Bearer {token}' - so to get the token, we have to split it
    // split authHeader to get the token
    const token = authHeader && authHeader.split(" ")[1]; // && prevent error if the token is missing (we get undefined in that case)
    if(!token){ // token not present - ie we get undefined
        // user is unauthenticated
        // we are returning here, so the next handler/callback (ie homepage route) will never be called - hence route is protected
        return res.status(401).json({   // 401 is status code for unauthorized
            success : false,
            message : 'Access Denied. No token provided. Please login to continue.'
        })
    }

    // 2. verify the token which gives the decoded token info

    // decode the token - get user info from token
    try{
        // verify() checks if the token is valid or not
        const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY) // pass token and the secret key
        console.log(decodedTokenInfo);
        
        // 3. attach user info to request for next middleware/handler/callback
        
        // now pass this decodedTokenInfo (that has the user info) in the request
        req.userInfo = decodedTokenInfo;

        next();
    }catch(error){
        return res.status(500).json({
            success : false,
            message : 'Access Denied. No token provided. Please login to continue.'
        })
    }
}

module.exports = authMiddleware;