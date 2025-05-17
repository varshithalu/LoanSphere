// components/UserLoanList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const UserLoanList = () => {
  const [loans, setLoans] = useState([]);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `/api/user/loans?status=${filter}&sortBy=${sort}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoans(res.data);
    } catch (err) {
      console.error("Error fetching loans:", err);
    }
  };

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Loan Applications</h2>

      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          onChange={(e) => setSort(e.target.value)}
          className="p-2 rounded border"
        >
          <option value="">Sort By</option>
          <option value="amount">Amount</option>
          <option value="date">Date</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loans.map((loan) => (
          <div key={loan._id} className="p-4 rounded shadow bg-white border">
            <h3 className="font-bold">Loan #{loan._id.slice(-6)}</h3>
            <p>
              Status: <span className="capitalize">{loan.status}</span>
            </p>
            <p>Amount: ₹{loan.amount}</p>
            <p>Applied on: {new Date(loan.createdAt).toLocaleDateString()}</p>
            <a
              href={`/dashboard/loan/${loan._id}`}
              className="text-blue-600 mt-2 inline-block"
            >
              View Details →
            </a>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Loan Applications</h2>
        <Link
          to="/dashboard/apply-loan"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply for New Loan
        </Link>
      </div>
    </div>
  );
};

export default UserLoanList;
