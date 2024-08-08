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
        if(!user) {
            return res.status(404).json({ error: 'User not found' });
        }
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
        const newDocument = await Document.create({ title:"untitled", data: "", shared: false });
        user.documents.push(newDocument._id);
        await user.save();
        res.status(200).json({ newDocument });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/checkAccess/:id', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(token === 'null') {
            return res.status(401).json({ error: 'User Not Logged In. Please Login.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: 'Unauthorized Access.' });
        }
        const user = await User.findOne({ username: decoded.id }).populate('documents').exec();
        if(!user) {
            return res.status(404).json({ error: 'User Not Found.' });
        }
        const documentId = req.params.id;
        var document = user.documents.find((doc) => doc._id.toString() === documentId);
        if (!document) {
            document = await Document.findById(documentId);
            if(!document) {
                return res.status(404).json({ error: 'Document Not Found' });
            }
            else if (!document.shared) {
                return res.status(403).json({ error: 'Access Denied.' });
            }
            else{
                return res.status(200).json({ title: document.title });
            }
        }
        res.status(200).json({ title: document.title });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/rename', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const document = await Document.findById(req.body._id);
        document.title = req.body.title;
        await document.save();
        res.status(200).json({ document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/share', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const document = await Document.findById(req.body.id);
        if(document.shared) {
            return res.status(400).json({ error: 'Document already shared' });
        }
        document.shared = true;
        await document.save();
        res.status(200).json({ });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
        

module.exports = router;