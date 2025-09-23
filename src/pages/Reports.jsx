// src/modules/Reports.jsx
import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DashboardLayout title="Analytics Reports" open={sidebarOpen} setOpen={setSidebarOpen}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Analytics Reports
        </Typography>
        <Typography>
          View analytics reports and performance here.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}