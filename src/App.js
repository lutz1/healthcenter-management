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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          {/* Default login page */}
          <Route path="/" element={<Login />} />

          {/* SuperAdmin routes */}
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

          {/* Management */}
          <Route path="/management/staff" element={<Staff />} />
          <Route path="/management/patients" element={<Patients />} />
          <Route path="/management/events" element={<Events />} />

          {/* Records & Data */}
          <Route path="/records/medical-records" element={<MedicalRecords />} />
          <Route path="/records/services" element={<Services />} />
          <Route path="/records/inventory" element={<Inventory />} />
          <Route path="/records/logs-history" element={<LogsHistory />} />

          {/* Analytics */}
          <Route path="/analytics/reports" element={<Reports />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Staff routes */}
          <Route path="/staff" element={<StaffDashboard />} />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;