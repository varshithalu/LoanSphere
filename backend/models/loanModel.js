// const mongoose = require("mongoose");

// const loanSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   amount: { type: Number, required: true },
//   tenure: { type: Number, required: true }, // in months
//   kycUrl: { type: String },
//   ai_decision: {
//     type: String,
//     enum: ["approved", "conditional", "rejected"],
//     default: "pending",
//   },
//   status: {
//     type: String,
//     enum: ["pending", "approved", "rejected"],
//     default: "pending",
//   },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Loan", loanSchema);

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
  aiConfidenceScore: Number, // optional
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  manualOverride: {
    overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    overrideDecision: {
      type: String,
      enum: ["approved", "rejected", "conditional"],
      default: null,
    },
    overrideReason: String,
    overrideTimestamp: Date,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loan", loanSchema);
