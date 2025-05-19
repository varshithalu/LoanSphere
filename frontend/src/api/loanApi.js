// src/api/loanApi.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const fetchAllLoans = async () => {
  const res = await axios.get(`${API_URL}/loan/all`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return res.data;
};

export const updateLoanStatus = async (loanId, newStatus) => {
  const res = await axios.put(
    `${API_URL}/loan/${loanId}/status`,
    { status: newStatus },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return res.data;
};
