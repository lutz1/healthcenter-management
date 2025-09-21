// src/modules/AdminDashboard.jsx
import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

// ✅ Glassmorphic style consistent with Topbar & Sidebar
const glassStyle = {
  background: "rgba(255, 255, 255, 1)", // same as Topbar/Sidebar
  backdropFilter: "blur(15px)",
  WebkitBackdropFilter: "blur(15px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "20px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-6px)", // subtle lift
    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
  },
};

export default function AdminDashboard() {
  // Sidebar menu items
  const menuItems = [
    { text: "Staff Overview", icon: <GroupIcon /> },
    { text: "Patient Overview", icon: <PeopleIcon /> },
    { text: "Service Forms", icon: <AssignmentIcon /> },
    { text: "Catered Patients", icon: <LocalHospitalIcon /> },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
      <Grid container spacing={3}>
        {/* Staff Overview */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={glassStyle}>
            <CardContent>
              <Box display="flex" gap={2} alignItems="center">
                <GroupIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">Staff Overview</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    12
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Patient Overview */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={glassStyle}>
            <CardContent>
              <Box display="flex" gap={2} alignItems="center">
                <PeopleIcon fontSize="large" color="secondary" />
                <Box>
                  <Typography variant="h6">Patient Overview</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    320
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Forms */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={glassStyle}>
            <CardContent>
              <Box display="flex" gap={2} alignItems="center">
                <AssignmentIcon fontSize="large" color="success" />
                <Box>
                  <Typography variant="h6">Service Forms</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    48
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Catered Patients */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={glassStyle}>
            <CardContent>
              <Box display="flex" gap={2} alignItems="center">
                <LocalHospitalIcon fontSize="large" color="error" />
                <Box>
                  <Typography variant="h6">Catered Patients</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    275
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}