import React from "react";
import { Typography, Box } from "@mui/material";

export default function Reports() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>
      <Typography>
        Generate and view analytical reports.
      </Typography>
    </Box>
  );
}