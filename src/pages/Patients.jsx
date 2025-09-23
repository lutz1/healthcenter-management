// Patients.jsx
import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Patients() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DashboardLayout title="Patients Management" open={sidebarOpen} setOpen={setSidebarOpen}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Patients Management
        </Typography>
        <Typography>
          Manage all patients here.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}