const connectDB = require('./database');
const socketConnection = require('./socket');
const express = require('express');
const cors = require('cors');
const userAuthRoutes = require('./routes/userAuth');
const userDocsRoutes = require('./routes/userDocs');
require('dotenv').config();

connectDB();

const app = express();
const server = require('http').createServer(app);
socketConnection(server);

app.use(express.json());
app.use(cors());
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/user/documents', userDocsRoutes);

const PORT = process.env.SERVER_PORT;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});