// routes/loanRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const Loan = require("../models/loanModel");
const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ───────── File‑upload (Multer) setup ─────────
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// ───────── Simple AI / rules engine ─────────
function evaluateLoan(amount, tenure) {
  if (amount <= 50_000 && tenure <= 12) return "approved";
  if (amount > 200_000) return "rejected";
  return "conditional";
}

// ───────── POST /api/loan/apply ─────────
router.post(
  "/apply",
  verifyToken,
  authorizeRoles(["borrower"]), // only borrowers apply
  upload.single("kyc"), // field name MUST be "kyc"
  async (req, res) => {
    try {
      const { amount, tenure } = req.body;
      const aiDecision = evaluateLoan(Number(amount), Number(tenure));

      const loan = new Loan({
        userId: req.user.id,
        amount,
        tenure,
        kycUrl: req.file ? `/uploads/${req.file.filename}` : null,
        aiDecision,
        status: "pending",
      });

      await loan.save();
      res
        .status(201)
        .json({ message: "Loan application submitted", aiDecision });
    } catch (err) {
      console.error("Loan apply error:", err.message);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

// ───────── GET /api/loan/my ─────────
router.get(
  "/my",
  verifyToken,
  authorizeRoles(["borrower"]),
  async (req, res) => {
    try {
      const loans = await Loan.find({ userId: req.user.id }).sort({
        createdAt: -1,
      });
      res.json(loans);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch loans" });
    }
  }
);

module.exports = router;
