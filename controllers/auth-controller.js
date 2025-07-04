// get User model
const User = require('../models/User');
// get bcryptjs for hashing password
const bcrypt = require('bcryptjs');
// get jsonwebtoken to create user token (bearer's token)
const jwt = require('jsonwebtoken');

// register controller
const registerUser = async(req, res) => {
    try{
        // we'll get the fields in req.body
        // extract user information from req.body
        const { username, email, password, role } = req.body; // {username, email, password} are the things we'll receive from the frontend (which we get in req.body) and then store it in DB (for now take role as well)
        
        // check if user already exists in our DB
        const checkExistingUser = await User.findOne({$or : [{username}, {email}]}) // $or will check if either username or email already exists in DB
        if(checkExistingUser){ // user already exists
            return res.status(404).json({
                success: false,
                message: "User already exists with same username or email. Please try with a different username or email."
            });
        }
        // user doesnt exist so hash the password using bcrypt.js and store everything in DB
        // hash the password
        // create salt
        const salt = await bcrypt.genSalt(10); // 10 is the number of rounds to use (default is also 10 if not passed)
        const hashedPassword = await bcrypt.hash(password, salt); // pass user input password (string) and salt to generate the hash
        // create a new user with this pass and save in DB
        const newlyCreatedUser = new User({ // or use .create() method then no need to use .save() later on
            username,
            email,
            password : hashedPassword,
            role : role || 'user',
        })
        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                success : true,
                message : "User registered successfully!"
            })
        } else{
            res.status(404).json({
                success : false,
                message : "Unable to register user. Please try again."
            })
        }
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Some error occured! Please try again.'
        })
    }
}

// login controller
const loginUser = async(req,res) => {
    try{
        // while login, we can give either username or email (since both are unique fields in our case) with the password to login
        // in this case, we use username
        // extract username and password from the req.body
        const {username, password} = req.body;
        // check if the username already exists in the DB for it to successfully login, otherwise register first
        // ie find if current user exists in DB
        const user = await User.findOne({username});
        if(!user){ // user doesnt exist
            return res.status(400).json({ // 400 status is invalid request since username doesnt exist in DB
                success : false,
                message : "User doesn't exist."
            })
        }
        // user exists
        // now check if the password is correct - ie whether the typed/entered password matches the decrypted hash password stored in our DB
        const isPasswordMatch = await bcrypt.compare(password, user.password); // pass entered password and the hash password stored in our DB
        if(!isPasswordMatch){ // wrong password
            return res.status(400).json({ // 400 status is invalid request since username doesnt exist in DB
                success : false,
                message : "Invalid credentials!"
            })
        }
        // now authenticate the user by creating a token - token is created only on successful login
        // this token is called `bearer token` which is digitally signed with server's secret (a private key) and this is used to authenticate

        // create user token (or access token) using json web token
        const accessToken = jwt.sign({ // pass user info (payload) and secret key (used to authenticate) and other options (like 'expiresIn' value - how long the token remains valid)
            userId : user._id, // all this info is stored in encrypted form as json web token
            username : user.username,
            role : user.role
        }, process.env.JWT_SECRET_KEY, {
            expiresIn : '30m' // token valid for 30 minutes only
        });

        res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            accessToken // passing back the access token - this is stored in encrypted form so we get weird string in res
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Some error occured! Please try again.'
        })
    }
}

// change password controller
const changePassword = async(req, res) => { // to change pass, you need to be authenticated user first
    try{
        // you have to be logged in to change the password
        // first get userId from auth middleware (from userInfo specifically)
        const userId = req.userInfo.userId;
        // extract old and new password from the frontend (check validation from frontend ie frontend handles that old and new pass cant be same) -> can be in backend also but not in our case (most cases)
        const {oldPassword, newPassword} = req.body;
        // find the current logged in user
        const user = await User.findById(userId);
        // check is user exists
        if(!user){ // user doesnt exist
            return res.status(400).json({
                success : false,
                message : 'User not found.'
            })
        }

        // user exists
        // now check if the old password is correct
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if(!isPasswordMatch){ // old password doesnt match
            return res.status(400).json({
                success : false,
                message : "Old password is incorrect. Please try again."
            })
        }

        // hash and store the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // update the user password and save
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success : true,
            message : "Password changed successfully."
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : 'Some error occured! Please try again.'
        })
    }
}

module.exports = {
    registerUser,
    loginUser, 
    changePassword
}