import React from "react";
import { Typography, Box } from "@mui/material";

export default function Patients() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Patient Management
      </Typography>
      <Typography>
        Manage all patients and their information here.
      </Typography>
    </Box>
  );
}