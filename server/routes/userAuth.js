const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = jwt.sign({ id: user.username }, 'secretKey');
        res.status(201).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(401).send({ error: 'Login failed!' });
        }
        const token = jwt.sign({ id: user._id }, 'secretKey');
        res.status(201).send({ user, token });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

module.exports = router;