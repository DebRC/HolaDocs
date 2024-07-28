const connectDB = require('./database');
const socketConnection = require('./socket');
const express = require('express');
const userAuthRoutes = require('./routes/userAuth');
require('dotenv').config();

connectDB();

const app = express();
const server = require('http').createServer(app);

socketConnection(server);

app.use('/api/user/auth', userAuthRoutes);

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});