// src/routes/adminRoutes.js
const express = require('express');
const adminController = require('../controllers/adminController');
const authorize = require('../middleware/authorization');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use('/admin', authorize('admin'));
router.use('/admin', adminController);

module.exports = router;
