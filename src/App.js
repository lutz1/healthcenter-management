// src/App.js
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import theme from "./theme";

// Dashboards
import SuperAdminDashboard from "./modules/SuperAdminDashboard";
import AdminDashboard from "./modules/AdminDashboard";
import StaffDashboard from "./modules/StaffDashboard";
import Login from "./modules/Login";

// SuperAdmin Pages
import Staff from "./pages/Staff";
import Patients from "./pages/Patients";
import Events from "./pages/Events";
import MedicalRecords from "./pages/MedicalRecords";
import Services from "./pages/Services";
import Inventory from "./pages/Inventory";
import LogsHistory from "./pages/LogsHistory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Auth Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// ---------- ProtectedRoute Component ----------
const ProtectedRoute = ({ children, allowedEmails = [], requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Special email-based access for SuperAdmin
  if (requiredRole === "superadmin" && !allowedEmails.includes(user.email)) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole && !allowedEmails.includes(user.email)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// ---------- AutoRedirect Component ----------
const AutoRedirect = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Email-based redirect for Robert
  if (user.email === "robert.llemit@gmail.com") return <Navigate to="/superadmin" replace />;

  switch (role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "staff":
      return <Navigate to="/staff" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* AutoRedirect on root */}
            <Route path="/" element={<AutoRedirect />} />

            {/* SuperAdmin routes */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/superadmin/dashboard"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Management */}
            <Route
              path="/management/staff"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/management/patients"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/management/events"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Events />
                </ProtectedRoute>
              }
            />

            {/* Records & Data */}
            <Route
              path="/records/medical-records"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/services"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/inventory"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/logs-history"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <LogsHistory />
                </ProtectedRoute>
              }
            />

            {/* Analytics */}
            <Route
              path="/analytics/reports"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole="superadmin" allowedEmails={["robert.llemit@gmail.com"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Staff routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute requiredRole="staff">
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;