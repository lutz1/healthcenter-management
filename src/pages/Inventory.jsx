import React from "react";
import { Typography, Box } from "@mui/material";

export default function Inventory() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Inventory
      </Typography>
      <Typography>
        Manage hospital inventory and supplies.
      </Typography>
    </Box>
  );
}