const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // in months
    kycUrl: String,

    /* ---------- AI result ---------- */
    aiDecision: {
      type: String,
      enum: ["approved", "conditional", "rejected", "manual"],
      default: "manual",
    },
    aiConfidenceScore: Number, // optional

    /* ---------- Current loan state ---------- */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "conditional"],
      default: "pending",
    },

    /* ---------- Manual overrides ---------- */
    manualOverride: {
      overriddenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      overrideDecision: {
        type: String,
        enum: ["approved", "rejected", "conditional"],
      },
      overrideReason: String,
      overrideTimestamp: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
