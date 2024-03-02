// src/routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/auth', authController);
module.exports = router;
