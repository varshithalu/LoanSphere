import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ManualOverrideForm from "./ManualOverrideForm";

const LoanDetail = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLoan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/user/loan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLoan(res.data);
    } catch (err) {
      console.error("Error fetching loan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!loan) return <div className="p-6">Loan not found</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">Loan Details</h2>
      <p>
        <strong>Status:</strong> {loan.status}
      </p>
      <p>
        <strong>Amount:</strong> ₹{loan.amount}
      </p>
      <p>
        <strong>Applied On:</strong>{" "}
        {new Date(loan.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Loan Term:</strong> {loan.term} months
      </p>
      <p>
        <strong>Interest Rate:</strong> {loan.interestRate}%
      </p>

      {/* AI Decision Section */}
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">AI Credit Risk Assessment</h3>
        <p>
          <strong>Decision:</strong> {loan.aiDecision || "N/A"}
        </p>
        <p>
          <strong>Confidence Score:</strong> {loan.aiConfidenceScore ?? "N/A"}
        </p>
      </div>

      {/* Manual Override Section */}
      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <h3 className="font-semibold mb-2">Manual Override</h3>
        {loan.manualOverride ? (
          <div>
            <p>
              <strong>Decision:</strong> {loan.manualOverride.overrideDecision}
            </p>
            <p>
              <strong>Reason:</strong> {loan.manualOverride.overrideReason}
            </p>
            <p>
              <strong>Overridden By:</strong>{" "}
              {loan.manualOverride.overriddenBy || "Admin"}
            </p>
            <p>
              <strong>At:</strong>{" "}
              {new Date(loan.manualOverride.overrideTimestamp).toLocaleString()}
            </p>
          </div>
        ) : (
          <p>No manual override applied yet.</p>
        )}

        {/* Show ManualOverrideForm only for admin users */}
        {/* You can replace this with your own auth logic */}
        {localStorage.getItem("role") === "admin" && (
          <ManualOverrideForm
            loanId={loan._id}
            currentOverride={loan.manualOverride}
            onUpdate={fetchLoan}
          />
        )}
      </div>

      {/* Rest of your existing loan details */}
      <p className="mt-4">
        <strong>Repayment Schedule:</strong>
      </p>
      <ul className="list-disc pl-5">
        {loan.repaymentSchedule?.map((emi, i) => (
          <li key={i}>
            {emi.dueDate} — ₹{emi.amount} — {emi.status}
          </li>
        ))}
      </ul>
      <p className="mt-4">
        <strong>KYC Documents:</strong>
      </p>
      <ul>
        {loan.kycDocs?.map((doc, i) => (
          <li key={i}>
            <a
              href={doc.url}
              className="text-blue-600"
              target="_blank"
              rel="noreferrer"
            >
              {doc.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoanDetail;
