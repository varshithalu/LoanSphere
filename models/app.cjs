const moment = require('moment');
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const Loan = require('./Loan');          // Correct: same folder
const Repayment = require('./Repayment'); // Correct: same folder
const Application = require('./Application'); // Fixed: remove extra ./models/

const sendReminder = require('../mailer'); // Assuming mailer.js is one level up

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/loanmgmt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ DB connection error:", err));

// Test route
app.get('/', (req, res) => {
  res.send("Loan Repayment System is Running 🚀");
});

// Create Loan & EMIs
app.post('/create-loan', async (req, res) => {
  try {
    const { userId, email, principal, interestRate, durationMonths } = req.body;

    const startDate = new Date();
    const monthlyRate = interestRate / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
                (Math.pow(1 + monthlyRate, durationMonths) - 1);

    const loan = await Loan.create({
      userId,
      email,
      principal,
      interestRate,
      durationMonths,
      loanBalance: parseFloat((emi * durationMonths).toFixed(2)),
      startDate
    });

    for (let i = 0; i < durationMonths; i++) {
      const dueDate = moment(startDate).add(i, 'months').toDate();
      await Repayment.create({
        loanId: loan._id,
        dueDate,
        emiAmount: parseFloat(emi.toFixed(2)),
        paid: false
      });
    }

    res.send({ message: "Loan created & EMIs scheduled", loanId: loan._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to create loan");
  }
});

// View Repayments
app.get('/repayments/:loanId', async (req, res) => {
  try {
    const repayments = await Repayment.find({ loanId: req.params.loanId });
    res.send(repayments);
  } catch (err) {
    res.status(500).send("❌ Error fetching repayments");
  }
});

// Mark EMI as Paid
app.patch('/repayments/:id/pay', async (req, res) => {
  try {
    const repayment = await Repayment.findById(req.params.id);
    if (!repayment) return res.status(404).send("❌ EMI not found");

    repayment.paid = true;
    repayment.paidOn = new Date();
    await repayment.save();

    await Loan.findByIdAndUpdate(repayment.loanId, {
      $inc: { loanBalance: -repayment.emiAmount }
    });

    res.send("✅ EMI marked as paid");
  } catch (err) {
    res.status(500).send("❌ Error marking EMI as paid");
  }
});

// Review Loan Application
app.patch('/review-loan/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).send("Application not found");

    const approved = application.aiScore >= 30;
    application.status = approved ? "Approved" : "Rejected";
    await application.save();

    res.send({
      message: approved ? "✅ Loan Approved" : "❌ Loan Rejected",
      status: application.status,
      aiScore: application.aiScore
    });
  } catch (err) {
    res.status(500).send("❌ Error reviewing application");
  }
});

// Start server
app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
