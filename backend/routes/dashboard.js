const express = require("express");
const router = express.Router();
const Loan = require("../models/loanModel");
const { authAdmin } = require("../middleware/authMiddleware");

// GET all loans with optional filters
router.get("/loans", authAdmin, async (req, res) => {
  try {
    const { status, userId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (userId) query.user = userId;

    const loans = await Loan.find(query).populate("userId", "name email");

    res.json({ total: loans.length, loans });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching loans" });
  }
});

// GET single loan by ID
router.get("/loans/:id", authAdmin, async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching loan" });
  }
});

module.exports = router;
