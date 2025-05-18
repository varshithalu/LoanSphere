// // const pool = require('../config/db');

// // exports.createLoan = (userId, amount, tenure, kycUrl, aiDecision) =>
// //   pool.query(
// //     `INSERT INTO loans (user_id, amount, tenure, kyc_url, status, ai_decision)
// //      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
// //     [userId, amount, tenure, kycUrl, 'pending', aiDecision]
// //   );

// // exports.getAllLoans = () => pool.query('SELECT * FROM loans');

// // exports.updateLoanStatus = (id, status) =>
// //   pool.query('UPDATE loans SET status = $1 WHERE id = $2 RETURNING *', [status, id]);

// const mongoose = require("mongoose");

// const loanSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   amount: { type: Number, required: true },
//   tenure: { type: Number, required: true },
//   kycUrl: { type: String },
//   status: { type: String, required: true },
//   aiDecision: { type: String },
//   createdAt: { type: Date, default: Date.now },
// });

// const Loan = mongoose.model("Loan", loanSchema);

// module.exports = Loan;

const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true }, // in months
  kycUrl: { type: String },
  ai_decision: {
    type: String,
    enum: ["approved", "conditional", "rejected"],
    default: "pending",
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loan", loanSchema);
