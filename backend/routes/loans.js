const express = require("express");
const axios = require("axios");
const router = express.Router();

const Loan = require("../models/loanModel");
const loanController = require("../controllers/loanController");
const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

/**
 * Build the exact payload expected by the ML micro‑service.
 * Make sure the property names match the FEATURE_COLUMNS list used in app.py
 */
function buildMLPayload(body) {
  return {
    Age: body.age,
    Gender: body.gender, // "Male" | "Female" | "Other"
    "Employment Type": body.employmentType, // "Salaried" | "Self‑Employed"
    "Annual Income": body.annualIncome,
    "Loan Amount Requested": body.loanAmountRequested,
    "Loan Tenure (Months)": body.tenureMonths,
    "Previous Loans Taken": body.previousLoansTaken || 0,
    "Previous Loan Defaults": body.previousLoanDefaults || 0,
    "Existing Loan Amounts": body.existingLoanAmounts || 0,
    "Debt-to-Income Ratio": body.dtiRatio,
    "Monthly EMI": body.monthlyEmi,
    "Missed EMI Payments": body.missedEmiPayments || 0,
    "Late Payment Charges": body.lateCharges || 0,
    "Credit Score": body.creditScore,
    "Loan Type": body.loanType, // e.g. "Personal", "Home", etc.
  };
}

// ─────────────── POST /api/loans/apply ───────────────
router.post(
  "/apply",
  verifyToken,
  authorizeRoles(["borrower"]), // only borrowers can apply
  loanController.uploadMiddleware, // multer for KYC / docs
  async (req, res, next) => {
    // 1️⃣  Call the ML micro‑service for a risk prediction
    try {
      const mlPayload = buildMLPayload(req.body);

      const { data } = await axios.post(
        process.env.ML_URL || "http://localhost:5000/predict",
        mlPayload
      );

      // Attach the prediction (approved / conditional / rejected)
      req.body.riskStatus = data.result;
    } catch (err) {
      console.error("ML service error:", err.message);
      return res
        .status(502)
        .json({ message: "Credit‑risk service unavailable" });
    }

    // 2️⃣  Continue to the main controller logic
    next();
  },
  loanController.applyLoan
);

// ─────────────── GET /api/loans ──────────────────────
router.get("/", verifyToken, authorizeRoles(["borrower"]), async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user.id });
    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

module.exports = router;
