import React from "react";
import { Typography, Box } from "@mui/material";

export default function Services() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Services
      </Typography>
      <Typography>
        Manage hospital services and procedures.
      </Typography>
    </Box>
  );
}