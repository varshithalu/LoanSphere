const nodemailer = require('nodemailer');
require('dotenv').config({ path: __dirname + '/.env' }); // ✅ Using correct path to .env

console.log("📦 Email user from .env:", process.env.EMAIL_USER);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Not loaded");

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'ballaritanzeela26@gmail.com',
    pass: 'rpqinhpephfcqrwq', // paste without spaces
  },
});



transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email connection failed:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

const sendEmail = async (to, subject, text) => {
  console.log("📤 Inside sendEmail");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, info.response);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};

module.exports = sendEmail;
