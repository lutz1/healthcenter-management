import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
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

import { AuthProvider, useAuth } from "./context/AuthContext";

// ✅ Loading Screen
const LoadingScreen = () => (
  <Box sx={{ textAlign: "center", mt: 20 }}>⏳ Loading...</Box>
);

// 🔒 Private Route wrapper
const PrivateRoute = ({ children, requiredRole }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (requiredRole && currentUser.role !== requiredRole) return <Navigate to="/not-authorized" replace />;

  return children;
};

// 🔑 Login route wrapper
const LoginRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (currentUser?.role) return <Navigate to={`/${currentUser.role}`} replace />;

  return <Login />;
};

// 🔑 Auto redirect after login
const AutoRedirect = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!currentUser?.role) return <Navigate to="/login" replace />;

  return <Navigate to={`/${currentUser.role}`} replace />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/" element={<AutoRedirect />} />

            {/* Superadmin */}
            <Route
              path="/superadmin"
              element={
                <PrivateRoute requiredRole="superadmin">
                  <SAdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/management/staff"
              element={
                <PrivateRoute requiredRole="admin">
                  <Staff />
                </PrivateRoute>
              }
            />
            <Route
              path="/management/patients"
              element={
                <PrivateRoute requiredRole="admin">
                  <Patients />
                </PrivateRoute>
              }
            />
            <Route
              path="/management/events"
              element={
                <PrivateRoute requiredRole="admin">
                  <Events />
                </PrivateRoute>
              }
            />
            <Route
              path="/records/medical-records"
              element={
                <PrivateRoute requiredRole="admin">
                  <MedicalRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/records/services"
              element={
                <PrivateRoute requiredRole="admin">
                  <Services />
                </PrivateRoute>
              }
            />
            <Route
              path="/records/inventory"
              element={
                <PrivateRoute requiredRole="admin">
                  <Inventory />
                </PrivateRoute>
              }
            />
            <Route
              path="/records/logs-history"
              element={
                <PrivateRoute requiredRole="admin">
                  <LogsHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics/reports"
              element={
                <PrivateRoute requiredRole="admin">
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute requiredRole="admin">
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* Staff */}
            <Route
              path="/staff"
              element={
                <PrivateRoute requiredRole="staff">
                  <StaffDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;