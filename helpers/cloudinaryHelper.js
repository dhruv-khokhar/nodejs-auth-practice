// this is the file where we write the logic for uploadin images to cloudinary - like a helper

// import cloudinary config so that we can use functions of cloudinary library in this file
const cloudinary = require('../config/cloudinary');

// upload to cloudinary fn
const uploadToCloudinary = async(filePath) => { // it receives a file path as input - the file that we'll upload
    try{
        const result = await cloudinary.uploader.upload(filePath)

        return { // we return 2 things -> secure_url and public_id
            url : result.secure_url,
            publicId : result.public_id
        };
    }catch(error){
        console.error("Error while uploading to cloudinary.", error);
        throw new Error("Error while uploading to cloudinary.")
    }
}

module.exports = {
    uploadToCloudinary
}