const path = require("path");
const multer = require("multer");
const axios = require("axios");
const Loan = require("../models/loanModel");
const fs = require("fs");
require("dotenv").config();

const ML_URL = process.env.ML_URL || "http://localhost:8000/predict";

/* ---------- Multer upload (single 'kyc' file) ---------- */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
exports.uploadMiddleware = multer({ storage }).single("kyc");

/* ---------- Simple rule‑based fallback ---------- */
const getAIDecision = (amount) => {
  if (amount < 50000) return "approved";
  if (amount > 200000) return "rejected";
  return "conditional";
};

/* ---------- Call ML micro‑service ---------- */
async function callCreditRiskAssessment(borrowerData) {
  try {
    const { data } = await axios.post(ML_URL, borrowerData, { timeout: 6000 });
    return data?.result; // "approved" | "conditional" | "rejected"
  } catch (err) {
    console.error("❌  ML service error:", err.message);
    return "manual"; // fall back
  }
}

/* ========================================================
   POST /api/loan/apply   (Borrower)
======================================================== */
exports.applyLoan = async (req, res) => {
  try {
    const { amount, tenure } = req.body;
    const amountNum = +amount;
    const tenureNum = +tenure;

    if (!amountNum || !tenureNum)
      return res
        .status(400)
        .json({ message: "Valid amount and tenure are required" });

    const user = req.user;
    if (!user)
      return res.status(401).json({ message: "User not authenticated" });

    /* --- prepare payload for ML --- */
    const borrowerData = {
      Age: user.age,
      Gender: user.gender,
      "Employment Type": user.employmentType,
      "Annual Income": user.annualIncome,
      "Loan Amount Requested": amountNum,
      "Loan Tenure (Months)": tenureNum,
      "Previous Loans Taken": user.prevLoans,
      "Previous Loan Defaults": user.prevDefaults,
      "Existing Loan Amounts": user.existingLoanAmount,
      "Debt-to-Income Ratio": user.dti,
      "Missed EMI Payments": user.missedEmis,
      "Late Payment Charges": user.lateCharges,
      "Credit Score": user.creditScore,
      "Loan Type": user.loanType,
    };

    /* --- AI decision --- */
    let aiDecision = await callCreditRiskAssessment(borrowerData);
    if (aiDecision === "manual") aiDecision = getAIDecision(amountNum);

    /* --- store loan --- */
    const loan = await Loan.create({
      userId: user.id,
      amount: amountNum,
      tenure: tenureNum,
      kycUrl: req.file ? `/uploads/${req.file.filename}` : null,
      aiDecision,
      status: aiDecision === "approved" ? "approved" : "pending",
    });

    res
      .status(201)
      .json({ message: "Loan application submitted", aiDecision, loan });
  } catch (err) {
    console.error("🔥  Loan apply error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ========================================================
   GET /api/loan/my   (Borrower list)
======================================================== */
exports.getUserLoans = async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const sort =
      sortBy === "amount"
        ? { amount: -1 }
        : sortBy === "date"
        ? { createdAt: -1 }
        : {};

    const loans = await Loan.find(filter).sort(sort);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ========================================================
   GET /api/loan/:id   (Borrower detail)
======================================================== */
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ========================================================
   PUT /api/loan/:loanId/decision   (Admin/Officer override)
======================================================== */
exports.updateLoanDecision = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { newDecision } = req.body;

    const allowed = ["approved", "conditional", "rejected"];
    if (!allowed.includes(newDecision))
      return res.status(400).json({ message: "Invalid decision value" });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    /* mark as manual override */
    loan.aiDecision = "manual";
    loan.status = newDecision;
    loan.manualOverride = {
      overriddenBy: req.user.id,
      overrideDecision: newDecision,
      overrideReason: req.body.reason || "Manual override",
      overrideTimestamp: new Date(),
    };
    await loan.save();

    res.json({ message: "Loan decision overridden manually", loan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
/* ========================================================
   DELETE /api/loan/:id   (Admin/Officer delete)  
======================================================== */
exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByIdAndDelete(id);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Delete KYC file if it exists
    if (loan.kycUrl) {
      const filePath = path.join(__dirname, "../..", loan.kycUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    }

    res.json({ message: "Loan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
