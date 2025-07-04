// this middleware handles the image upload functionality

// first get multer - helps to store resource (that the client sends) locally in your server
const multer = require('multer');
const path = require('path');

// 3 steps : define storage - where and how (naming) to store locally, filter fn - to accept a particular resource, create the middleware - set its options

// set our multer storage
const storage = multer.diskStorage({ // check multer's documentation for syntax
    destination : function(req, file, cb){ // pass request object, file we are uploading and callback fn
        cb(null, "uploads/"); // "uploads/" is the path where the images need to be uploaded locally
    },
    filename : function(req, file, cb){ // used to determine what the file should be named inside the folder (given above)
        cb(null, 
            file.fieldname + "-" + Date.now() + path.extname(file.originalname) // creates a unique file name
        )
    }
});

// file filter function - to upload only image (not videos etc.)
const checkFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    }else {
        cb(new Error('Not an image! Please upload only images.'))
    }
}

// create multer middleware - will be used in our routes
module.exports = multer({
    storage : storage,
    fileFilter : checkFileFilter,
    limits : {
        fileSize : 5 * 1024 * 1024 // 5MB in bytes - file size limit
    }
})