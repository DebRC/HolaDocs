const axios = require('axios');
const Document = require('./models/document');
require('dotenv').config();

const socketConnection = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: process.env.CLIENT_URI,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socket.on("get-document", async ({ documentId, token }) => {
            try {
                await axios.get(`${process.env.SERVER_URI}/api/user/documents/checkAccess/${documentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const document = await findDocument(documentId);
                socket.join(documentId);
                socket.emit("load-document", document.data);

                socket.on("send-changes", (delta) => {
                    socket.broadcast.to(documentId).emit("receive-changes", delta);
                });

                socket.on("save-document", async (data) => {
                    await Document.findByIdAndUpdate(documentId, { data });
                });
            } catch (error) {
                socket.emit("document-error", error.response.data.error);
            }

        });
    });

    async function findDocument(id) {
        if (id == null) return;

        const document = await Document.findById(id);
        if (document) return document;
        return null;
    }
};

module.exports = socketConnection;