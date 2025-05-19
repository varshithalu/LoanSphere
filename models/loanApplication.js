const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
    applicantName: String,
    loanAmount: Number,
    status: String,
    appliedDate: Date
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
