const mongoose = require('mongoose');

const repaymentSchema = new mongoose.Schema({
    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false
    }
});

const Repayment = mongoose.model('Repayment', repaymentSchema);

module.exports = Repayment;
