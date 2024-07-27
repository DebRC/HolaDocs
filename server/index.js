const mongoose = require('mongoose')
const Document = require('./schema')

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected…")
    })
    .catch(err => console.log(err))

const io = require('socket.io')(process.env.SERVER_PORT, {
    cors: {
        origin: process.env.CLIENT_URI,
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    socket.on("get-document", async (documentId) => {
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId)
        socket.emit("load-document", document.data)

        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta)
        })

        socket.on("save-document", async (data) => {
            await Document.findByIdAndUpdate(documentId, { data })
        })
    })
})

async function findOrCreateDocument(id){
    if(id == null) return

    const document = await Document.findById(id)

    if(document) return document

    return await Document.create({_id: id, data: process.env.DEFAULT_DOCUMENT})
}