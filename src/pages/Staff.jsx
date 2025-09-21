import React from "react";
import { Typography, Box } from "@mui/material";

export default function Staff() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Staff Management
      </Typography>
      <Typography>
        Manage all staff members here.
      </Typography>
    </Box>
  );
}