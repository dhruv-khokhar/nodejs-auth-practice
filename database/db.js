// connect to database
const mongoose = require('mongoose');

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    }catch(e){
        console.error("MongoDB Connection Failed");
        process.exit(1);
    }
}

// export it so that it can be imported in server.js where we'll invoke it since that is the root file
module.exports = connectToDB;