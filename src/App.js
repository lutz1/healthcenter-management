// src/App.jsx
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import theme from "./theme";

// Dashboards
import AdminDashboard from "./modules/AdminDashboard";
import StaffDashboard from "./modules/StaffDashboard";
import SAdminDashboard from "./modules/SAdminDashboard";
import Login from "./modules/Login";

// Admin Pages
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

const LoadingScreen = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  // 🔒 Role check
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AutoRedirect = () => {
  const { user, role, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  // 🔑 Redirect by role
  if (role === "superadmin") return <Navigate to="/superadmin" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "staff") return <Navigate to="/staff" replace />;

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <HashRouter>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Auto redirect by role */}
            <Route path="/" element={<AutoRedirect />} />

            {/* Superadmin routes */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute requiredRole="superadmin">
                  <SAdminDashboard />
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
            <Route
              path="/management/staff"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/management/patients"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
              path="/management/events"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/medical-records"
              element={
                <ProtectedRoute requiredRole="admin">
                  <MedicalRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Services />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/inventory"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/records/logs-history"
              element={
                <ProtectedRoute requiredRole="admin">
                  <LogsHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
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
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;