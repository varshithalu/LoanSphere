import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OfficerDashboard from "./pages/OfficerDashboard";
import BorrowerDashboard from "./components/BorrowerDashboard"; // <-- Added this import
import LoanDetail from "./components/LoanDetail"; // <-- Added if this component exists

import LoanApplication from "./components/LoanApplication";
import LoanApplicationForm from "./components/LoanApplicationForm";
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard/officer" element={<OfficerDashboard />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <PrivateRoute>
              <LoanApplication />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/apply-loan"
          element={
            <PrivateRoute>
              <LoanApplication />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/borrower"
          element={
            <PrivateRoute role="borrower">
              <BorrowerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/loan/:id"
          element={
            <PrivateRoute role={["borrower", "officer", "admin"]}>
              <LoanDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
