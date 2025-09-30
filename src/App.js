import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import theme from "./theme";

// Dashboards
import SAdminDashboard from "./modules/SAdminDashboard";
import AdminDashboard from "./modules/AdminDashboard";
import StaffDashboard from "./modules/StaffDashboard";
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

// Loading Screen
const LoadingScreen = () => (
  <Box sx={{ textAlign: "center", mt: 20 }}>⏳ Loading...</Box>
);

// PrivateRoute for role-based access
const PrivateRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) return <Navigate to="/not-authorized" replace />;

  return children;
};

// Auto redirect after login
const AutoRedirect = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (loading || !currentUser || !currentUser.role) return;

    if (currentUser.role === "superadmin") navigate("/superadmin", { replace: true });
    else if (currentUser.role === "admin") navigate("/admin", { replace: true });
    else if (currentUser.role === "staff") navigate("/staff", { replace: true });
  }, [currentUser, loading, navigate]);

  return <LoadingScreen />;
};

// Login route wrapper
const LoginRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (currentUser && currentUser.role) {
    if (currentUser.role === "superadmin") return <Navigate to="/superadmin" replace />;
    if (currentUser.role === "admin") return <Navigate to="/admin" replace />;
    if (currentUser.role === "staff") return <Navigate to="/staff" replace />;
  }

  return <Login />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<LoginRoute />} />

            {/* Auto redirect */}
            <Route path="/" element={<AutoRedirect />} />

            {/* Superadmin */}
            <Route
              path="/superadmin"
              element={
                <PrivateRoute allowedRoles={["superadmin"]}>
                  <SAdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Admin Pages */}
            {[
              { path: "/management/staff", Component: Staff },
              { path: "/management/patients", Component: Patients },
              { path: "/management/events", Component: Events },
              { path: "/records/medical-records", Component: MedicalRecords },
              { path: "/records/services", Component: Services },
              { path: "/records/inventory", Component: Inventory },
              { path: "/records/logs-history", Component: LogsHistory },
              { path: "/analytics/reports", Component: Reports },
              { path: "/settings", Component: Settings },
            ].map(({ path, Component }) => (
              <Route
                key={path}
                path={path}
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <Component />
                  </PrivateRoute>
                }
              />
            ))}

            {/* Staff */}
            <Route
              path="/staff"
              element={
                <PrivateRoute allowedRoles={["staff"]}>
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