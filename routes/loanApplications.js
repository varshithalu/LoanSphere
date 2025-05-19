const express = require("express");
const router = express.Router();
const LoanApplication = require("../models/LoanApplication");

// Get all loan applications
router.get("/", async (req, res) => {
    try {
        const loans = await LoanApplication.find().sort({ appliedDate: -1 });
        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
