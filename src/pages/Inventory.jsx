// src/modules/Inventory.jsx
import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Inventory() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DashboardLayout title="Inventory Management" open={sidebarOpen} setOpen={setSidebarOpen}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Inventory Management
        </Typography>
        <Typography>
          Manage all inventory items here.
        </Typography>
      </Box>
    </DashboardLayout>
  );
}