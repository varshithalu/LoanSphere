// // models/LoanApplication.js (Mongoose example)
// const mongoose = require("mongoose");

// const LoanApplicationSchema = new mongoose.Schema({
//   // existing fields
//   applicantName: String,
//   amount: Number,
//   aiDecision: {
//     type: String,
//     enum: ["approve", "reject", "conditional"],
//   },
//   aiConfidenceScore: Number, // optional
//   // New override fields
//   manualOverride: {
//     overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     overrideDecision: {
//       type: String,
//       enum: ["approve", "reject", "conditional"],
//       default: null,
//     },
//     overrideReason: String,
//     overrideTimestamp: Date,
//   },
//   // ...other fields
// });
