// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load EMAIL_USER & EMAIL_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify connection config
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email connection failed:', error);
  } else {
    console.log('✅ Email service is ready to send messages');
  }
});

const sendEmail = async (to, subject, text) => {
  console.log('📨 Preparing to send email...');
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📤 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Error sending email:', err);
  }
};

module.exports = sendEmail;
