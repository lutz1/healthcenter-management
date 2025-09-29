// src/modules/SuperAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

const glassStyle = {
  background: "rgba(255, 255, 255, 0.67)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  // Real-time clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Check auth & fetch Firestore user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/"); // not logged in
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "superadmin") {
          navigate("/"); // not superadmin
          return;
        }
        setUsername(userDoc.data().name || "Super Admin");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/"); // redirect on error
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );

  // Dashboard Data
  const menuItems = [
    { text: "Staff Overview", icon: <GroupIcon /> },
    { text: "Patient Overview", icon: <PeopleIcon /> },
    { text: "Service Forms", icon: <AssignmentIcon /> },
    { text: "Catered Patients", icon: <LocalHospitalIcon /> },
    { text: "System Logs", icon: <SecurityIcon /> },
  ];

  const activityLogs = [
    { id: 1, message: "Admin John updated Staff Records", timestamp: "2025-09-20 10:32 AM" },
    { id: 2, message: "Admin Maria added a new Patient", timestamp: "2025-09-20 09:45 AM" },
    { id: 3, message: "System backup completed", timestamp: "2025-09-19 11:10 PM" },
  ];

  return (
    <DashboardLayout title="Super Admin Dashboard" menuItems={menuItems}>
      {/* Header Row: Welcome + Time */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} px={2}>
        <Typography variant="h6" fontWeight="bold">
          Welcome, {username} 👋
        </Typography>
        <Box display="flex" alignItems="center" gap={1.5}>
          <AccessTimeIcon fontSize="medium" color="primary" />
          <Box textAlign="right">
            <Typography variant="body1" fontWeight="bold">
              {time.toLocaleTimeString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {time.toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
        {/* Stats Cards */}
        <Grid item xs={12} container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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
          <Grid item xs={12} sm={6} md={3}>
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

        {/* Admin Activity Logs */}
        <Grid item xs={12} md={4}>
          <Card sx={{ ...glassStyle, height: 350 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Activity
              </Typography>
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