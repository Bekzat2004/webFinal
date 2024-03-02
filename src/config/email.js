// src/config/email.js
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'beki.bekovich2004@gmail.com',
    pass: 'nagl dlro rkhl xywe',
  },
});
module.exports = transporter;
