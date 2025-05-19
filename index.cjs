const moment = require('moment'); // for easy date math
const express = require('express');
const mongoose = require('mongoose');
const Loan = require('./models/Loan');
const Repayment = require('./models/Repayment');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loanmgmt', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ DB connection error:", err));

// Home route
app.get('/', (req, res) => {
  res.send("Loan Repayment System is Running 🚀");
});

// Create loan and schedule repayments
app.post('/create-loan', async (req, res) => {
  try {
    const { userId, principal, interestRate, durationMonths } = req.body;

    const startDate = new Date();
    const monthlyRate = interestRate / 12;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) /
                (Math.pow(1 + monthlyRate, durationMonths) - 1);

    const loan = await Loan.create({
      userId,
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

    res.send({ message: "Loan created and EMI schedule generated", loanId: loan._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Failed to create loan");
  }
});

// Get repayments by loan ID
app.get('/repayments/:loanId', async (req, res) => {
  try {
    const repayments = await Repayment.find({ loanId: req.params.loanId });
    res.send(repayments);
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Error fetching repayments");
  }
});

// Start the server
app.listen(3000, () => {
  console.log("✅ Server is running on http://localhost:3000");
});
