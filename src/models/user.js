// src/models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  age: Number,
  country: String,
  gender: String,
  email: String,
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
