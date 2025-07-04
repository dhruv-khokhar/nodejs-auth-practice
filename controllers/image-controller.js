// import the Image model
const Image = require('../models/Image');
// import the cloudinaryHelper
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
// import file system - after saving the image to Cloudinary and DB, we need to delete it locally
const fs = require('fs');
// import cloudinary
const cloudinary = require('../config/cloudinary');

// 1st controller - to upload image in our DB
const uploadImageController = async(req, res) => {
    try{
        // the request object contains the file data like file path - if file is missing, return error
        // check if file is missing in request object
        if(!req.file){
            return res.status(400).json({ // 400 -> Bad Request
                success : false,
                message : 'File is required. Please upload an image.'
            })
        }
        // file not missing, so upload to cloudinary
        const {url, publicId} = await uploadToCloudinary(req.file.path);
        // store the image url and public id along with the uploaded user id in the DB
        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy : req.userInfo.userId // since we're also passing userInfo in req as shown previously so we fetch the userId from there
            // we get this userInfo since its there from authMiddleware which gets executed before this controller so this userInfo is available to use here
        })
        await newlyUploadedImage.save(); // stores in DB

        // delete file from local storage now - unlincSync() deletes a file from your local file system synchronously
        fs.unlinkSync(req.file.path); // due to this, no image added to 'uploads' folder since we are removing it after uploading

        res.status(201).json({
            success : true,
            message : 'Image uploaded successfully',
            image : newlyUploadedImage
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong. Please try again.'
        })
    }
}

// 2nd controller - to fetch all images that we've uploaded
// all authenticated users can fetch images
const fetchImagesController = async (req, res) => {
    try{
        // pagination & sorting
        const page = parseInt(req.query.page) || 1; // gives the current page - basically the page no. you've clicked on in your frontend or passed in your query (?) | '|| 1' is the fallback
        const limit = parseInt(req.query.limit) || 2; // images to show at a time (in one page)
        const skip = (page - 1) * limit; // how many images to skip - say you're on page 2, so you have to skip the first 5 (limit in this case) pages
        const sortBy = req.query.sortBy || 'createdAt'; // sort by the query param passed or the created at date-time by default (fallback) is query param missing/undefined
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1; // sort in ascending order (1) if 'asc' or else desc order (-1)
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages/limit); // total pages created
        // applying the query params to our app - by passing this object in .find() method below when fetching images
        const sortObj = {};
        sortObj[sortBy] = sortOrder;

        // fetch all images - done before pagination concept
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit); // before -> await Image.find({});
        if(images){
            res.status(200).json({
                success : true,
                currentPage : page,
                totalPages : totalPages,
                totalImages : totalImages,
                data : images
            });
        }
    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong. Please try again.'
        })
    }
}

// 3rd controller - to delete an image from both cloudinary and mongoDB
const deleteImageController = async(req, res) => {
    try{
        const getCurrentIdOfImageToBeDeleted = req.params.id; // we get the image id in request object indicating which image to delete
        const userId = req.userInfo.userId; // we get this from authMiddleware

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
        // check if image exists or not in DB
        if(!image){ // image doesnt exist
            return res.status(404).json({
                success : false,
                message : 'Image not found.'
            })
        }
        // image exists
        // check if image is uploaded by the current user who is trying to delete this image
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success : false,
                message : "You are not authorized to delete this image because you haven't uploaded it"
            })
        }
        // delete this image - user matched
        // delete image first from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);
        // now delete from DB
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);
        res.status(200).json({
            success : true,
            message : 'Image deleted successfully.'
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success : false,
            message : 'Something went wrong. Please try again.'
        })
    }
}

module.exports = {
    uploadImageController, 
    fetchImagesController,
    deleteImageController
};