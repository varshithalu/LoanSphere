const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const Loan = require("../models/loanModel");

const {
  uploadMiddleware,
  applyLoan,
  getUserLoans,
  getLoanById,
  updateLoanDecision,
} = require("../controllers/loanController");

const { verifyToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/* ─────────────────── Borrower ─────────────────── */
router.post(
  "/apply",
  verifyToken,
  authorizeRoles(["borrower"]),
  uploadMiddleware,
  applyLoan
);

router.get("/my", verifyToken, authorizeRoles(["borrower"]), getUserLoans);

router.get("/:id", verifyToken, authorizeRoles(["borrower"]), getLoanById);

/* ─────────────────── Sanction Letter (Admin/Officer) ─────────────────── */
router.get(
  "/:id/sanction-letter",
  verifyToken,
  authorizeRoles(["admin", "loan_officer"]),
  async (req, res) => {
    try {
      const loan = await Loan.findById(req.params.id);
      if (!loan) return res.status(404).send("Loan not found");

      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=sanction_letter_${loan.id}.pdf`
      );

      doc.pipe(res);
      doc
        .fontSize(20)
        .text("Loan Sanction Letter", { align: "center" })
        .moveDown();
      doc
        .fontSize(12)
        .text(`Loan ID: ${loan.id}`)
        .text(`Borrower Name: ${loan.borrowerName || "—"}`)
        .text(`Loan Amount Sanctioned: ₹${loan.amount}`)
        .text(`Loan Tenure: ${loan.tenure} months`)
        .text(`Interest Rate: ${loan.interestRate || "—"}%`)
        .moveDown()
        .text("Congratulations! Your loan has been sanctioned.")
        .text("Please read all terms and conditions carefully.");
      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  }
);

/* ─────────────────── Manual override ─────────────────── */
router.put(
  "/:loanId/decision",
  verifyToken,
  authorizeRoles(["admin", "loan_officer"]),
  updateLoanDecision
);

module.exports = router;
