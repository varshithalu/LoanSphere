const express = require("express");
const router = express.Router();

const Loan = require("../models/loanModel");
const loanController = require("../controllers/loanController");
const verifyToken = require("../middlewares/authMiddleware").verifyToken;
const authorizeRoles = require("../middlewares/roleMiddleware");

// ─────────────── POST /api/loans/apply ───────────────
router.post(
  "/apply",
  verifyToken,
  authorizeRoles(["borrower"]), // only borrowers apply
  loanController.uploadMiddleware, // e.g. multer for KYC files
  loanController.applyLoan
);

// ─────────────── GET /api/loans ──────────────────────
router.get("/", verifyToken, authorizeRoles(["borrower"]), async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user.id });
    res.json(loans);
  } catch {
    res.status(500).json({ message: "Failed to fetch loans" });
  }
});

module.exports = router;
