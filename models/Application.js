const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: String,
  income: Number,
  amountRequested: Number,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  aiScore: Number,
  appliedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
