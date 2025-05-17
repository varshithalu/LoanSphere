// const loanModel = require('../models/loanModel');
// const aiService = require('../services/aiService');
// const generateSanctionLetter = require('../utils/generateSanctionLetter');

// exports.applyLoan = async (req, res) => {
//   const { amount, tenure } = req.body;
//   const kycUrl = req.file ? req.file.path : null;
//   const aiDecision = aiService.evaluateRisk({ amount, tenure });

//   const { rows } = await loanModel.createLoan(req.user.id, amount, tenure, kycUrl, aiDecision);
//   res.json(rows[0]);
// };

// exports.getAllLoans = async (req, res) => {
//   const { rows } = await loanModel.getAllLoans();
//   res.json(rows);
// };

// exports.approveLoan = async (req, res) => {
//   const { loanId } = req.params;
//   const { status } = req.body;

//   const { rows } = await loanModel.updateLoanStatus(loanId, status);
//   const sanctionLetter = generateSanctionLetter(rows[0]);

//   res.json({ updated: rows[0], sanctionLetter });
// };
const Loan = require("../models/loanModel");
const multer = require("multer");
const path = require("path");

// Multer config for KYC upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

exports.uploadMiddleware = upload.single("kyc");

exports.applyLoan = async (req, res) => {
  try {
    const { amount, tenure } = req.body;
    const kycUrl = req.file ? req.file.path : null;

    // Validate required fields
    if (!amount || !tenure) {
      return res
        .status(400)
        .json({ message: "Amount and tenure are required" });
    }

    // Convert amount and tenure to numbers (since they come from form-data)
    const amountNum = Number(amount);
    const tenureNum = Number(tenure);

    // AI Decision logic
    let aiDecision = "reject"; // default
    if (amountNum <= 500000 && tenureNum <= 12) {
      aiDecision = "approve";
    } else if (amountNum <= 1000000 && tenureNum <= 24) {
      aiDecision = "conditional";
    }

    const loan = new Loan({
      userId: req.user.id,
      amount: amountNum,
      tenure: tenureNum,
      kycUrl,
      aiDecision,
      status: "pending",
    });

    await loan.save();

    res.status(201).json({ message: "Loan application submitted", loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// user dashboard api -- user loanlist.jsx
exports.getUserLoans = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, sortBy } = req.query;

    let filter = { userId };
    if (status) filter.status = status;

    let sort = {};
    if (sortBy === "amount") sort.amount = -1;
    else if (sortBy === "date") sort.createdAt = -1;

    const loans = await Loan.find(filter).sort(sort);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// loan view page api -- loan detail.jsx
exports.getLoanById = async (req, res) => {
  try {
    const userId = req.user.id;
    const loan = await Loan.findOne({ _id: req.params.id, userId });

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    res.json(loan);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
