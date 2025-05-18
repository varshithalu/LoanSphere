import { useState } from "react";
import axios from "axios";

const ManualOverrideForm = ({ loanId, currentOverride, onUpdate }) => {
  const [overrideDecision, setOverrideDecision] = useState(
    currentOverride?.overrideDecision || ""
  );
  const [overrideReason, setOverrideReason] = useState(
    currentOverride?.overrideReason || ""
  );
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `/api/admin/loan/${loanId}/manual-override`,
        {
          overrideDecision,
          overrideReason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMsg("Manual override saved.");
      onUpdate(); // Callback to refresh loan data in parent component
    } catch {
      setMsg("Failed to save override.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border rounded bg-gray-50"
    >
      <h3 className="text-lg font-semibold mb-2">Manual Override</h3>
      <label className="block mb-2">
        Decision:
        <select
          value={overrideDecision}
          onChange={(e) => setOverrideDecision(e.target.value)}
          required
          className="block w-full mt-1 p-2 border rounded"
        >
          <option value="">Select Decision</option>
          <option value="approve">Approve</option>
          <option value="reject">Reject</option>
          <option value="conditional">Conditional</option>
        </select>
      </label>

      <label className="block mb-2">
        Reason:
        <textarea
          value={overrideReason}
          onChange={(e) => setOverrideReason(e.target.value)}
          required
          rows={3}
          className="block w-full mt-1 p-2 border rounded"
          placeholder="Explain the reason for override"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Saving..." : "Save Override"}
      </button>
      {msg && <p className="mt-2">{msg}</p>}
    </form>
  );
};

export default ManualOverrideForm;
