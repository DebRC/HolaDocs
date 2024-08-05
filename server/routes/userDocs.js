const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Document = require('../models/document');
const router = express.Router();

require('dotenv').config();

router.get('/get', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user = await User.findOne({ username: decoded.id }).populate('documents').exec();
        const documents = user.documents.map((document) => {
            return {
            _id: document._id,
            title: document.title
            };
        });
        res.status(200).json({ documents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/create', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const user  = await User.findOne({ username: decoded.id });
        const newDocument = await Document.create({ title:"untitled", data: "" });
        user.documents.push(newDocument._id);
        await user.save();
        res.status(200).json({ newDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
        

module.exports = router;