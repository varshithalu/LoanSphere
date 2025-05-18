const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourgmail@gmail.com',        // your gmail address
    pass: 'your_app_password_here'      // app password from Step 2
  }
});

function sendReminder(toEmail, subject, message) {
  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: toEmail,
    subject,
    text: message
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log("❌ Error:", error);
    } else {
      console.log("📧 Email sent:", info.response);
    }
  });
}

module.exports = sendReminder;
