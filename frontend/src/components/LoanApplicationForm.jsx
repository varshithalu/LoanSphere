import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoanApplicationForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    term: "",
    // other fields...
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
        }));
      } catch (err) {
        console.error("Failed to prefill user info:", err);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/loan/apply", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Redirect to dashboard after successful submission
      navigate("/dashboard");
    } catch (err) {
      console.error("Loan application failed:", err);
      // Optional: show error message
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-white rounded shadow max-w-xl mx-auto"
    >
      <input
        type="text"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Email"
        required
      />
      <input
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        placeholder="Loan Amount"
        required
      />
      <input
        type="text"
        value={form.term}
        onChange={(e) => setForm({ ...form, term: e.target.value })}
        placeholder="Loan Term"
        required
      />
      {/* Add other inputs as needed */}
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit Loan
      </button>
    </form>
  );
};

export default LoanApplicationForm;
