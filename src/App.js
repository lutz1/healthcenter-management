import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

// Import your dashboards
import SuperAdminDashboard from "./modules/SuperAdminDashboard";
// import AdminDashboard from "./modules/AdminDashboard";
// import StaffDashboard from "./modules/StaffDashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* 👇 Pick which dashboard to render */}
      <SuperAdminDashboard />
      {/* <AdminDashboard /> */}
      {/* <StaffDashboard /> */}
    </ThemeProvider>
  );
}

export default App;