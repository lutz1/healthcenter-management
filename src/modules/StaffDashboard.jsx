import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import DashboardLayout from "../layouts/DashboardLayout";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.2)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
};

export default function StaffDashboard() {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auth guard
  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== "staff")) {
      navigate("/login");
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const menuItems = [
    { text: "Patient Monitoring", icon: <PeopleIcon /> },
    { text: "Service Forms", icon: <AssignmentIcon /> },
    { text: "Catered Patients", icon: <LocalHospitalIcon /> },
  ];

  return (
    <DashboardLayout title="Staff Dashboard (BHW)" menuItems={menuItems}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} px={2}>
        <Typography variant="h6" fontWeight="bold">
          Welcome, {currentUser.name || currentUser.email} 👋
        </Typography>
        <Box display="flex" alignItems="center" gap={1.5}>
          <AccessTimeIcon fontSize="medium" color="primary" />
          <Box textAlign="right">
            <Typography variant="body1" fontWeight="bold">{time.toLocaleTimeString()}</Typography>
            <Typography variant="body2" color="textSecondary">{time.toLocaleDateString()}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={3}>
        {[ 
          { icon: <PeopleIcon fontSize="large" color="secondary" />, title: "Patient Monitoring", value: 120 },
          { icon: <AssignmentIcon fontSize="large" color="success" />, title: "Service Forms", value: 35 },
          { icon: <LocalHospitalIcon fontSize="large" color="error" />, title: "Catered Patients", value: 98 },
        ].map((item, i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card sx={glassStyle}>
              <CardContent>
                <Box display="flex" gap={2} alignItems="center">
                  {item.icon}
                  <Box>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="h5" fontWeight="bold">{item.value}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </DashboardLayout>
  );
}