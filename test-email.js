console.log("🟡 test-email.js started"); // To confirm script is running
require('dotenv').config();  // at the very top of your mailer.js or test-email.js

const sendEmail = require('./utils/mailer');

async function test() {
  console.log("🟡 Calling sendEmail()");
  await sendEmail('ballaritanzeela26@gmail.com', 'Test Email', 'Hello from your Loan System!');
  console.log("🟢 sendEmail() finished");
}

test().catch(err => {
  console.error("❌ Error in test():", err);
});
