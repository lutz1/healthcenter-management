import React, { useEffect, useState } from "react";
import { Box, Grid, Card, CardContent, Typography, CircularProgress, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Motion variant
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" } }),
};

// Glass style
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
  const { currentUser, loading } = useAuth();
  const [time, setTime] = useState(new Date());

  // Admin Activity placeholder
  const [adminActivity] = useState([
    { id: 1, text: "Logged in", time: "10:02 AM" },
    { id: 2, text: "Reviewed patient records", time: "10:15 AM" },
    { id: 3, text: "Updated staff info", time: "11:00 AM" },
    { id: 4, text: "Generated service report", time: "11:30 AM" },
  ]);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if not superadmin
  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== "superadmin")) {
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

  // Menu items
  const menuItems = [
    { text: "Staff Overview", icon: <GroupIcon /> },
    { text: "Patient Overview", icon: <PeopleIcon /> },
    { text: "Service Forms", icon: <AssignmentIcon /> },
    { text: "Catered Patients", icon: <LocalHospitalIcon /> },
  ];

  return (
    <DashboardLayout title="Super Admin Dashboard" menuItems={menuItems}>
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} px={2}>
          <Typography variant="h6" fontWeight="bold">
            Welcome, {currentUser.name || currentUser.email} 👋
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
      </motion.div>

      <Grid container spacing={3} justifyContent="center">
        {/* Stats Cards */}
        <Grid item xs={12} container spacing={3} justifyContent="center">
          {[
            { icon: <GroupIcon color="primary" />, title: "Staff Overview", value: 25 },
            { icon: <PeopleIcon color="secondary" />, title: "Patient Overview", value: 540 },
            { icon: <AssignmentIcon color="success" />, title: "Service Forms", value: 120 },
            { icon: <LocalHospitalIcon color="error" />, title: "Catered Patients", value: 490 },
          ].map((item, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <motion.div custom={i} initial="hidden" animate="visible" variants={fadeUp}>
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
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Admin Activity */}
        <Grid item xs={12} md={4}>
          <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
            <Card sx={{ ...glassStyle, height: 500 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Admin Activity
                </Typography>
                <List sx={{ maxHeight: 420, overflowY: "auto" }}>
                  {adminActivity.map((act, i) => (
                    <React.Fragment key={act.id}>
                      <ListItem>
                        <ListItemText primary={act.text} secondary={act.time} />
                      </ListItem>
                      {i < adminActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}