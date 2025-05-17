// components/LoanDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const LoanDetail = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/user/loan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoan(res.data);
      } catch (err) {
        console.error("Error fetching loan:", err);
      }
    };
    fetchLoan();
  }, [id]);

  if (!loan) return <div className="p-6">Loading...</div>;

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
      <p>
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
