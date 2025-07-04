const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url : {
        type : String,
        required : true
    },
    publicId : {
        type : String,
        required : true
    },
    uploadedBy : { // stores the user that is currently uploading image
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
}, {timestamps : true});

module.exports = mongoose.model('Image', imageSchema); 