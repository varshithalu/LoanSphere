import React, { useEffect, useState } from "react";
import { fetchAllLoans, updateLoanStatus } from "../api/loanApi";
import LoanTable from "../components/LoanTable";
import LoanModal from "../components/LoanModal";

const statusColors = {
  approved: "bg-green-200 text-green-800",
  rejected: "bg-red-200 text-red-800",
  conditional: "bg-orange-200 text-orange-800",
  pending: "bg-gray-200 text-gray-800",
};

export default function OfficerDashboard() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;

  const role = localStorage.getItem("role"); // 'officer' or 'admin'

  const loadLoans = async () => {
    setLoading(true);
    try {
      const data = await fetchAllLoans();
      setLoans(data);
    } catch (err) {
      console.error("Error loading loans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus]);

  const handleStatusChange = async (loanId, newStatus) => {
    try {
      await updateLoanStatus(loanId, newStatus);
      loadLoans();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredLoans =
    filterStatus === "all"
      ? loans
      : loans.filter((loan) => loan.status === filterStatus);

  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * loansPerPage,
    currentPage * loansPerPage
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {role === "admin" ? "Admin Dashboard" : "Officer Dashboard"}
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Filter loans by status"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="conditional">Conditional</option>
          <option value="pending">Pending</option>
        </select>
      </header>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : (
        <>
          <table className="min-w-full bg-white shadow rounded overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Loan ID</th>
                <th className="py-3 px-6 text-left">Applicant</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLoans.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No loans found.
                  </td>
                </tr>
              )}
              {paginatedLoans.map((loan) => (
                <tr key={loan._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6">{loan._id.slice(-6)}</td>
                  <td className="py-3 px-6">{loan.applicantName}</td>
                  <td className="py-3 px-6">₹{loan.amount.toLocaleString()}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[loan.status] || "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {loan.status.charAt(0).toUpperCase() +
                        loan.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center space-x-2">
                    <button
                      onClick={() => setSelectedLoan(loan)}
                      className="text-indigo-600 hover:underline"
                      aria-label={`View details for loan ${loan._id}`}
                    >
                      View
                    </button>

                    {(role === "officer" || role === "admin") && (
                      <>
                        {loan.status !== "approved" && (
                          <button
                            onClick={() =>
                              handleStatusChange(loan._id, "approved")
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            aria-label={`Approve loan ${loan._id}`}
                          >
                            Approve
                          </button>
                        )}
                        {loan.status !== "rejected" && (
                          <button
                            onClick={() =>
                              handleStatusChange(loan._id, "rejected")
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            aria-label={`Reject loan ${loan._id}`}
                          >
                            Reject
                          </button>
                        )}
                        {loan.status !== "conditional" && (
                          <button
                            onClick={() =>
                              handleStatusChange(loan._id, "conditional")
                            }
                            className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                            aria-label={`Mark loan ${loan._id} conditional`}
                          >
                            Conditional
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
            >
              Prev
            </button>
            <span className="px-4 py-2 border border-gray-300 rounded">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedLoan && (
        <LoanModal loan={selectedLoan} onClose={() => setSelectedLoan(null)} />
      )}
    </div>
  );
}
