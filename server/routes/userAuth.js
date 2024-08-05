const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        if(req.body.username.length < 3 || req.body.password.length < 3){
            return res.status(400).send({ error: 'Username and Password must be atleast 3 characters long.' });
        }
        const user = new User({username: req.body.username, password: req.body.password});
        await user.save();
        const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user){
            return res.status(404).send({ error: 'User does not exist. Please Sign Up.' });
        }
        if(req.body.password !== user.password) {
            return res.status(401).send({ error: 'Incorrect Password.' });
        }
        const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = router;