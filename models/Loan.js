const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: String,
  userEmail: String, // <-- Add this field
  principal: Number,
  interestRate: Number,
  durationMonths: Number,
  loanBalance: Number,
  startDate: Date
});

module.exports = mongoose.model('Loan', loanSchema);
