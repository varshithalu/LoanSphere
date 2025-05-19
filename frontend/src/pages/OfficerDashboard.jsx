import React, { useEffect, useState } from "react";
import { fetchAllLoans, updateLoanStatus } from "../api/loanApi";
import LoanTable from "../components/LoanTable";
import LoanModal from "../components/LoanModal";

export default function OfficerDashboard() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const loansPerPage = 5;

  const loadLoans = async () => {
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

  // Reset to first page when filter changes
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

  // Filter loans based on selected status
  const filteredLoans =
    filterStatus === "all"
      ? loans
      : loans.filter((loan) => loan.status === filterStatus);

  // Pagination logic
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * loansPerPage,
    currentPage * loansPerPage
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Loan Applications</h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="conditional">Conditional</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <LoanTable
            loans={paginatedLoans}
            onStatusChange={handleStatusChange}
            onViewDetails={(loan) => setSelectedLoan(loan)}
          />

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 border">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
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
