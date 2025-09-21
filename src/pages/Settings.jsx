import React from "react";
import { Typography, Box } from "@mui/material";

export default function Settings() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography>
        Manage system settings and preferences.
      </Typography>
    </Box>
  );
}