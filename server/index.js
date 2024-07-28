const connectDB = require('./database');
const socketConnection = require('./socket');
const express = require('express');
require('dotenv').config();

connectDB();

const app = express();
const server = require('http').createServer(app);

socketConnection(server);

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});