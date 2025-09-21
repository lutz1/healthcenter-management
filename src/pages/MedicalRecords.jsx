import React from "react";
import { Typography, Box } from "@mui/material";

export default function MedicalRecords() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Medical Records
      </Typography>
      <Typography>
        View and manage all medical records here.
      </Typography>
    </Box>
  );
}