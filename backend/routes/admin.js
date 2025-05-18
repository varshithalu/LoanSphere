const express = require("express");
const router = express.Router();
const LoanApplication = require("../models/loanApplication");
const { authAdmin } = require("../middlewares/authMiddleware");

router.post("/loan/:id/manual-override", authAdmin, async (req, res) => {
  try {
    const loanId = req.params.id;
    const { overrideDecision, overrideReason } = req.body;
    const adminId = req.user?._id;

    if (!adminId) {
      return res.status(401).json({ error: "Admin user info missing" });
    }

    if (!["approve", "reject", "conditional"].includes(overrideDecision)) {
      return res.status(400).json({ error: "Invalid override decision" });
    }

    if (!overrideReason || overrideReason.trim().length < 5) {
      return res.status(400).json({
        error: "Override reason is required and should be descriptive.",
      });
    }

    const loan = await LoanApplication.findById(loanId);
    if (!loan)
      return res.status(404).json({ error: "Loan application not found" });

    loan.manualOverride = {
      overriddenBy: adminId,
      overrideDecision,
      overrideReason,
      overrideTimestamp: new Date(),
    };

    loan.status = overrideDecision;
    await loan.save();

    return res.json({
      message: "Manual override saved successfully",
      manualOverride: loan.manualOverride,
      status: loan.status,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
