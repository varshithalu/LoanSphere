import { useState } from "react";
import axios from "axios";

const LoanApplication = () => {
  const [form, setForm] = useState({ amount: "", tenure: "" });
  const [kycDocument, setKycDocument] = useState(null);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setIsError(false);

    if (!kycDocument) {
      setIsError(true);
      return setMsg("Please upload your KYC document.");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setIsError(true);
      return setMsg("You must be logged in to apply.");
    }

    const fd = new FormData();
    fd.append("amount", form.amount);
    fd.append("tenure", form.tenure);
    fd.append("kyc", kycDocument);

    try {
      await axios.post("http://localhost:5000/api/loan/apply", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setMsg("Loan application submitted successfully!");
      setForm({ amount: "", tenure: "" });
      setKycDocument(null);
    } catch (err) {
      console.error("Submit error:", err);
      setIsError(true);
      setMsg(err.response?.data?.message || "Submission failed.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto p-6 space-y-5 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Apply for a Loan
      </h2>

      {msg && (
        <p
          className={`text-center font-medium ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {msg}
        </p>
      )}

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Loan Amount"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="number"
        name="tenure"
        value={form.tenure}
        onChange={handleChange}
        placeholder="Tenure (months)"
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={(e) => setKycDocument(e.target.files[0])}
        className="w-full"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
      >
        Submit Application
      </button>
    </form>
  );
};

export default LoanApplication;
