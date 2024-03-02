// src/config/db.js
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:1234@cluster0.rvhg67a.mongodb.net/blogs_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
