// src/modules/MedicalRecords.jsx
import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";

export default function MedicalRecords() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DashboardLayout title="Medical Records" open={sidebarOpen} setOpen={setSidebarOpen}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Medical Records
        </Typography>
        <Typography>
          Manage patient medical records here.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}