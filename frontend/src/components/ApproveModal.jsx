import { useState } from "react";

export default function ApproveModal({ loan, onClose, onConfirm }) {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-semibold">
          Approve Loan #{loan._id.slice(-6)}
        </h2>

        <input
          className="input"
          type="number"
          placeholder="Approved Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <input
          className="input"
          type="number"
          placeholder="Tenure (months)"
          value={tenure}
          onChange={(e) => setTenure(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={() =>
              onConfirm(loan._id, Number(amount), Number(rate), Number(tenure))
            }
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
