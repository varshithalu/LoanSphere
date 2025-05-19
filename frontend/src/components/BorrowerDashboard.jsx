import React, { useEffect, useState } from "react";
import { fetchUserLoans } from "../api/loanApi"; // Your API for borrower-specific data

export default function BorrowerDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLoans = async () => {
      try {
        const data = await fetchUserLoans(); // Should fetch loans only for the logged-in borrower
        setLoans(data);
      } catch (err) {
        console.error("Failed to load loans", err);
      } finally {
        setLoading(false);
      }
    };

    loadLoans();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Loan Applications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : loans.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <ul className="space-y-4">
          {loans.map((loan) => (
            <li key={loan._id} className="bg-white p-4 rounded shadow">
              <p>
                <strong>Amount:</strong> ₹{loan.amount}
              </p>
              <p>
                <strong>Status:</strong> {loan.status}
              </p>
              <p>
                <strong>Purpose:</strong> {loan.purpose}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
