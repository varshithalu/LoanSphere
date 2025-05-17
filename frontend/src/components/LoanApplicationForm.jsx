import { useEffect, useState } from "react";
import axios from "axios";

const LoanApplicationForm = () => {
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

  return (
    <form className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      {/* Example pre-filled inputs */}
      <input
        type="text"
        value={form.name ?? ""}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="email"
        value={form.email ?? ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
    </form>
  );
};

export default LoanApplicationForm;
