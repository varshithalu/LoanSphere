// routes/loanRoutes.js
const express = require("express");
const router = express.Router();

const {
  uploadMiddleware,
  applyLoan,
  getUserLoans,
  getLoanById,
  updateLoanDecision,
} = require("../controllers/loanController");

const { verifyToken } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

// ───────── POST /api/loan/apply ─────────
router.post(
  "/apply",
  verifyToken,
  authorizeRoles(["borrower"]),
  uploadMiddleware, // ✅ correctly defined and imported from controller
  applyLoan
);

// ───────── GET /api/loan/my ─────────
router.get("/my", verifyToken, authorizeRoles(["borrower"]), getUserLoans);

// ───────── GET /api/loan/:id ─────────
router.get("/:id", verifyToken, authorizeRoles(["borrower"]), getLoanById);

// ───────── PUT /api/loan/:loanId/decision ─────────
router.put(
  "/:loanId/decision",
  verifyToken,
  authorizeRoles(["admin", "loan_officer"]),
  updateLoanDecision
);

module.exports = router;
