// role-based auth to access admin pages

const isAdminUser = (req,res, next) => {
    if(req.userInfo.role !== 'admin'){ // we get this from authMiddleware
        return res.status(403).json({ // 403 status code means Forbidden - ie you are authenticated but not authorized
            success : false,
            message : 'Access Denied! Admin rights required.'
        })
    }
    // if user has 'admin role' - simply call next()
    next();
}

module.exports = isAdminUser;