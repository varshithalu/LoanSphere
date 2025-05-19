// // src/components/LoanTable.jsx
// export default function LoanTable({ loans, onStatusChange, onViewDetails }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full text-sm text-left border">
//         <thead className="bg-gray-100 text-xs uppercase">
//           <tr>
//             <th className="px-4 py-2">Name</th>
//             <th className="px-4 py-2">Amount</th>
//             <th className="px-4 py-2">Status</th>
//             <th className="px-4 py-2">Type</th>
//             <th className="px-4 py-2">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {loans.map((loan) => (
//             <tr key={loan._id} className="border-t">
//               <td className="px-4 py-2">{loan.borrowerName}</td>
//               <td className="px-4 py-2">₹{loan.loanAmountRequested}</td>
//               <td className="px-4 py-2 capitalize">{loan.status}</td>
//               <td className="px-4 py-2">{loan.loanType}</td>
//               <td className="px-4 py-2 space-x-2">
//                 <button
//                   onClick={() => onViewDetails(loan)}
//                   className="text-blue-600 hover:underline"
//                 >
//                   View
//                 </button>
//                 <button
//                   onClick={() => onStatusChange(loan._id, "approved")}
//                   className="text-green-600 hover:underline"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() => onStatusChange(loan._id, "rejected")}
//                   className="text-red-600 hover:underline"
//                 >
//                   Reject
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
export default function LoanTable({
  loans,
  onQuickDecision,
  onApprove,
  onViewDetails,
}) {
  return (
    <table className="w-full">
      <thead>…</thead>
      <tbody>
        {loans.map((loan) => (
          <tr key={loan._id} className="border-b">
            <td>{loan._id.slice(-6)}</td>
            <td>{loan.borrowerName}</td>
            <td>{loan.amount}</td>
            <td>{loan.status}</td>
            {/* AI suggestion badge */}
            <td>
              {loan.aiDecision && (
                <span className="px-2 py-1 text-xs rounded bg-blue-100">
                  {loan.aiDecision.decision.toUpperCase()}
                </span>
              )}
            </td>

            <td>
              {loan.status === "pending" && (
                <>
                  <button
                    className="btn-primary mr-2"
                    onClick={() => onApprove(loan)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-secondary mr-2"
                    onClick={() => onQuickDecision(loan._id, "conditional")}
                  >
                    Conditional
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => onQuickDecision(loan._id, "rejected")}
                  >
                    Reject
                  </button>
                </>
              )}

              {loan.status === "approved" && loan.sanctionLetterUrl && (
                <a
                  href={loan.sanctionLetterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600"
                >
                  Letter
                </a>
              )}

              <button
                className="ml-2 underline"
                onClick={() => onViewDetails(loan)}
              >
                Details
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
