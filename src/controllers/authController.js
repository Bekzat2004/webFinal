// src/controllers/authController.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');
const User = require('../models/user');
const transporter = require('../config/email');

const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/create-admin', (req, res) => {
    res.sendFile(__dirname + '/../create-admin.html');
});

function authorize(role) {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (userRole === role) {
            next();
        } else {
            res.status(403).json({ error: 'Access forbidden' });
        }
    };
}

router.get('/admin', authorize('admin'), (req, res) => {
    res.send('Admin Page');
});

router.get('/admin', authorize('admin'), (req, res) => {
    res.sendFile(__dirname + '/../admin.html');
});

router.get('/create-admin', (req, res) => {
    res.sendFile(__dirname + '/../create-admin.html');
});

const sendWelcomeEmail = (email, username) => {
    const mailOptions = {
        from: 'beki.bekovich2004@gmail.com',
        to: email,
        subject: 'Welcome to Your Website',
        text: `Hello ${username},\n\nWelcome to Your Website! We're excited to have you on board.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending welcome email:', error);
        } else {
            console.log('Welcome email sent:', info.response);
        }
    });
};

const sendNotificationEmail = (email, action) => {
    const mailOptions = {
        from: 'beki.bekovich2004@gmail.com',
        to: email,
        subject: 'Website Notification',
        text: `Hello,\n\nYou have a new notification: ${action}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending notification email:', error);
        } else {
            console.log('Notification email sent:', info.response);
        }
    });
};

router.post('/register', async (req, res) => {
    try {
        const {
            username,
            password,
            firstName,
            lastName,
            age,
            country,
            gender,
            email,
            role
        } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: await bcrypt.hash(password, 10),
            firstName,
            lastName,
            age,
            country,
            gender,
            email,
            role
        });

        await newUser.save();
        sendWelcomeEmail(req.body.email, req.body.username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (user) {
            req.session.user = user; // Store user information in the session
          }
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            res.status(200).json({ message: 'Login successful', role: user.role });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
