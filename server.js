// this is the root file

require('dotenv').config(); // load environment variables from .env file
const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes')

// invoke connectToDB() to establish connection
connectToDB();

const app = express(); // express instance
const PORT = process.env.port || 3000;

// middlewares - express.json() to parson req.body which is in JSON
app.use(express.json());

app.use('/api/auth', authRoutes); // '/api/auth' is the base route
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);

// start server
app.listen(PORT, () => {
    console.log(`Server is now listening to PORT ${PORT}`);
});