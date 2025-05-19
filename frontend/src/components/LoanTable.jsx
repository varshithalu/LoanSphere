// src/components/LoanTable.jsx
export default function LoanTable({ loans, onStatusChange, onViewDetails }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100 text-xs uppercase">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id} className="border-t">
              <td className="px-4 py-2">{loan.borrowerName}</td>
              <td className="px-4 py-2">₹{loan.loanAmountRequested}</td>
              <td className="px-4 py-2 capitalize">{loan.status}</td>
              <td className="px-4 py-2">{loan.loanType}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onViewDetails(loan)}
                  className="text-blue-600 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => onStatusChange(loan._id, "approved")}
                  className="text-green-600 hover:underline"
                >
                  Approve
                </button>
                <button
                  onClick={() => onStatusChange(loan._id, "rejected")}
                  className="text-red-600 hover:underline"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
