import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/loan/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load loans.");
      }
    };

    fetchLoans();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        My Loan Applications
      </h2>
      {error && (
        <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
      )}

      {loans.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No loan applications yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="p-3 text-left text-gray-700 font-medium">
                  Amount
                </th>
                <th className="p-3 text-left text-gray-700 font-medium">
                  Tenure (months)
                </th>
                <th className="p-3 text-left text-gray-700 font-medium">
                  AI Decision
                </th>
                <th className="p-3 text-left text-gray-700 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr
                  key={loan._id}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">₹{loan.amount}</td>
                  <td className="p-3">{loan.tenure}</td>
                  <td className="p-3 capitalize">{loan.aiDecision}</td>
                  <td className="p-3 capitalize">{loan.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold">Welcome back!</h2>
        <p className="mb-4">You can apply for a new loan below.</p>

        <Link
          to="/dashboard/apply-loan"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply for New Loan
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
