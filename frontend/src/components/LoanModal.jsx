// src/components/LoanModal.jsx
import React from "react";

export default function LoanModal({ loan, onClose }) {
  if (!loan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
        <ul className="space-y-1 text-sm">
          <li>
            <strong>Name:</strong> {loan.borrowerName}
          </li>
          <li>
            <strong>Age:</strong> {loan.age}
          </li>
          <li>
            <strong>Gender:</strong> {loan.gender}
          </li>
          <li>
            <strong>Employment:</strong> {loan.employmentType}
          </li>
          <li>
            <strong>Income:</strong> ₹{loan.annualIncome}
          </li>
          <li>
            <strong>Loan Amount:</strong> ₹{loan.loanAmountRequested}
          </li>
          <li>
            <strong>Tenure:</strong> {loan.loanTenure} months
          </li>
          <li>
            <strong>Type:</strong> {loan.loanType}
          </li>
          <li>
            <strong>Status:</strong> {loan.status}
          </li>
        </ul>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={() =>
              window.open(`/api/loan/${loan._id}/sanction-letter`, "_blank")
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Sanction Letter
          </button>
        </div>
      </div>
    </div>
  );
}
