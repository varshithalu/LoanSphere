const path = require("path");
const multer = require("multer");
const axios = require("axios");
const Loan = require("../models/loanModel");

/* ------------------------------------------------------------------
   1.  File‑upload (Multer) setup  ➜  exports.uploadMiddleware
------------------------------------------------------------------ */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, "uploads/"),
  filename: (_, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });
exports.uploadMiddleware = upload.single("kyc"); // form‑data field name = kyc

/* ------------------------------------------------------------------
   2.  Rule‑based AI helper (fallback)
------------------------------------------------------------------ */
const getAIDecision = (amount) => {
  if (amount < 50000) return "approved";
  if (amount > 200000) return "rejected";
  return "conditional";
};

/* ------------------------------------------------------------------
   3. Call Flask ML API
------------------------------------------------------------------ */
async function callCreditRiskAssessment(borrowerData) {
  try {
    const response = await axios.post(
      "http://localhost:5000/predict",
      borrowerData
    );
    return response.data.result; // "approved", "conditional", or "rejected"
  } catch (err) {
    console.error("ML service error:", err.message);
    return "manual"; // fallback if prediction fails
  }
}

/* ------------------------------------------------------------------
   4. Borrower ➜ POST /api/loan/apply
       Apply for loan with ML decision integration
------------------------------------------------------------------ */
exports.applyLoan = async (req, res) => {
  try {
    const { amount, tenure } = req.body;
    if (!amount || !tenure) {
      return res
        .status(400)
        .json({ message: "Amount and tenure are required" });
    }

    const amountNum = Number(amount);
    const tenureNum = Number(tenure);

    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Prepare data to send to ML service
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

    // Call ML microservice for AI decision
    let aiDecision = await callCreditRiskAssessment(borrowerData);

    // Fallback to rule-based if ML fails
    if (aiDecision === "manual") {
      aiDecision = getAIDecision(amountNum);
    }

    // Create loan with AI decision and status
    const loan = await Loan.create({
      userId: user.id,
      amount: amountNum,
      tenure: tenureNum,
      kycUrl: req.file ? `/uploads/${req.file.filename}` : null,
      ai_decision: aiDecision,
      status: aiDecision === "approved" ? "approved" : "pending",
    });

    res
      .status(201)
      .json({ message: "Loan application submitted", aiDecision, loan });
  } catch (err) {
    console.error("Loan apply error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------------
   5. Borrower ➜ GET /api/loan/my  (list own loans)
------------------------------------------------------------------ */
exports.getUserLoans = async (req, res) => {
  try {
    const { status, sortBy } = req.query;
    const filter = { userId: req.user.id };
    if (status) filter.status = status;

    const sort = {};
    if (sortBy === "amount") sort.amount = -1;
    else if (sortBy === "date") sort.createdAt = -1;

    const loans = await Loan.find(filter).sort(sort);
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------------------------------------------------
   6. Borrower ➜ GET /api/loan/:id  (loan detail)
------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------
   7. Admin / Officer ➜ PUT /api/loan/:loanId/decision
       Manual override of AI decision
------------------------------------------------------------------ */
exports.updateLoanDecision = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { newDecision } = req.body;

    const allowed = ["approved", "conditional", "rejected"];
    if (!allowed.includes(newDecision))
      return res.status(400).json({ message: "Invalid decision value" });

    const updated = await Loan.findByIdAndUpdate(
      loanId,
      { ai_decision: newDecision, status: newDecision },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Loan not found" });
    res.json({ message: "AI decision updated", loan: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
