// routes/loanOverride.js
const express = require("express");
const router = express.Router();
const Loan = require("../models/loanModel"); // your Loan model
const { verifyAdminOrOfficer } = require("../middlewares/authMiddleware"); // middleware to check role

// POST /loans/:loanId/override
router.post("/:loanId/override", verifyAdminOrOfficer, async (req, res) => {
  const { loanId } = req.params;
  const { overrideDecision, overrideReason } = req.body;
  const userId = req.user._id; // from auth middleware

  if (!["approve", "reject", "conditional"].includes(overrideDecision)) {
    return res.status(400).json({ message: "Invalid override decision" });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    // Update manualOverride fields
    loan.manualOverride = {
      overriddenBy: userId,
      overrideDecision,
      overrideReason,
      overrideTimestamp: new Date(),
    };

    // Optionally, update loan status based on overrideDecision
    loan.status =
      overrideDecision === "approve"
        ? "approved"
        : overrideDecision === "reject"
        ? "rejected"
        : "pending";

    await loan.save();

    return res.json({ message: "Override saved", loan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
