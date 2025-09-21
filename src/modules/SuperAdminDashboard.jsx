import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.67)", // same as Topbar/Sidebar
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
};

export default function SuperAdminDashboard() {
  const menuItems = [
    { text: "Staff Overview", icon: <GroupIcon /> },
    { text: "Patient Overview", icon: <PeopleIcon /> },
    { text: "Service Forms", icon: <AssignmentIcon /> },
    { text: "Catered Patients", icon: <LocalHospitalIcon /> },
    { text: "System Logs", icon: <SecurityIcon /> },
  ];

  return (
    <DashboardLayout title="Super Admin Dashboard" menuItems={menuItems}>
      <Grid container spacing={3}  justifyContent="center" alignItems="center"       >
        {/* Staff Overview */}
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={glassStyle}>
            <CardContent>
              <Box display="flex" gap={2} alignItems="center">
                <GroupIcon fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h6">Staff Overview</Typography>
                  <Typography variant="h5" fontWeight="bold">25</Typography>
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
                  <Typography variant="h5" fontWeight="bold">540</Typography>
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
                  <Typography variant="h5" fontWeight="bold">120</Typography>
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
                  <Typography variant="h5" fontWeight="bold">490</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  ); 
}