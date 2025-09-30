import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography, Box, List, ListItem, ListItemText, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.67)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, loading } = useAuth();
  const [time, setTime] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== "admin")) {
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
    { text: "Staff Overview", icon: <GroupIcon /> },
    { text: "Patient Overview", icon: <PeopleIcon /> },
    { text: "Service Forms", icon: <AssignmentIcon /> },
    { text: "Catered Patients", icon: <LocalHospitalIcon /> },
    { text: "System Logs", icon: <SecurityIcon /> },
  ];

  const activityLogs = [
    { id: 1, message: "Staff John updated Patient Records", timestamp: "2025-09-20 10:32 AM" },
    { id: 2, message: "Staff Maria added a new Patient", timestamp: "2025-09-20 09:45 AM" },
    { id: 3, message: "System backup completed", timestamp: "2025-09-19 11:10 PM" },
  ];

  return (
    <DashboardLayout title="Admin Dashboard" menuItems={menuItems}>
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

      {/* Dashboard Content */}
      <Grid container spacing={3} justifyContent="center">
        {/* Stats Cards */}
        <Grid item xs={12} container spacing={3} justifyContent="center">
          {[ 
            { icon: <GroupIcon fontSize="large" color="primary" />, title: "Staff Overview", value: 25 },
            { icon: <PeopleIcon fontSize="large" color="secondary" />, title: "Patient Overview", value: 540 },
            { icon: <AssignmentIcon fontSize="large" color="success" />, title: "Service Forms", value: 120 },
            { icon: <LocalHospitalIcon fontSize="large" color="error" />, title: "Catered Patients", value: 490 },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
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

        {/* Admin Activity Logs */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, height: 350 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Admin Activity</Typography>
              <List dense>
                {activityLogs.map((log) => (
                  <ListItem key={log.id} divider>
                    <ListItemText primary={log.message} secondary={log.timestamp} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}