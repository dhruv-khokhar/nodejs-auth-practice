const express = require('express');
const router = express.Router();

// middlewares needed to protect the routes
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');
// middleware to upload - uploadMiddleware (multer)
const uploadMiddleware = require('../middleware/upload-middleware');
// contorller to upload image
const { uploadImageController, fetchImagesController, deleteImageController } = require('../controllers/image-controller')

// 2 routes - upload image and get all images

// upload the image
router.post(
    '/upload', 
    authMiddleware, 
    adminMiddleware, // if this is removed, then anyone can upload an image
    uploadMiddleware.single('image'), // uploadMiddleware.single('image') specifies that only single image will be uploaded
    uploadImageController
); 

// get all images
router.get('/get', authMiddleware, fetchImagesController);

// delete image - userId: 68631a5b78fa8cd9a8d4aa51
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController);

module.exports = router;