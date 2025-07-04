// User model

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true, // this means that username field is required/mandatory
        unique : true, // username has to be unique (two usernames cannot be same)
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true // email has to be in lowercase
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user', 'admin'], // enum restrict the value to only the options provided ie only allow 'user' or 'admin' roles (user and admin in this case, can also have 'superAdmin')
        default : 'user'
    }
}, {timestamps : true}); // mongoose automatically adds 'createdAt' and 'updatedAt' fields (so no manual updation work)

module.exports = mongoose.model('User', userSchema); // 'User' is the collection name -> give meaningful names always