import React from "react";
import { Typography, Box } from "@mui/material";

export default function Events() {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Events
      </Typography>
      <Typography>
        Manage hospital events, schedules, and activities.
      </Typography>
    </Box>
  );
}