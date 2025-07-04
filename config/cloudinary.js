// this if the config file for cloudinary - like logging in to the cloudinary account from NodeJS app

const cloudinary = require('cloudinary').v2; // we need to import v2 from cloudinary package (as per its documentation)

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})

module.exports = cloudinary;