// src/controllers/adminController.js
const express = require('express');
const router = express.Router();

router.get('/create-admin', (req, res) => {
    res.sendFile(__dirname + '/../create-admin.html');
});

module.exports = router;
