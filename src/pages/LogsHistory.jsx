import React from "react";
import { Typography, Box } from "@mui/material";

export default function LogsHistory() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Logs & History
      </Typography>
      <Typography>
        Review system logs and activity history.
      </Typography>
    </Box>
  );
}