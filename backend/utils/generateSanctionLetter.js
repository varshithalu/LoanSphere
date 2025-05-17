module.exports = (loan) => {
    return `
    Loan Sanction Letter
    ---------------------
    Loan ID: ${loan.id}
    Borrower ID: ${loan.user_id}
    Amount: ₹${loan.amount}
    Tenure: ${loan.tenure} months
    Status: ${loan.status}
    Issued on: ${new Date().toLocaleDateString()}
    `;
  };
  