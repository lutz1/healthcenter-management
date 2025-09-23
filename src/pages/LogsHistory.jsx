// src/modules/LogsHistory.jsx
import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";

export default function LogsHistory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DashboardLayout title="Logs & History" open={sidebarOpen} setOpen={setSidebarOpen}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Logs & History
        </Typography>
        <Typography>
          Review system logs and history here.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}