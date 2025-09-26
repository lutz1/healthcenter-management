// src/modules/SuperAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Icons
import GroupIcon from "@mui/icons-material/Group";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SecurityIcon from "@mui/icons-material/Security";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import MedicationIcon from "@mui/icons-material/Medication";
import PieChartIcon from "@mui/icons-material/PieChart";

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Leaflet
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Charts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Motion
import { motion } from "framer-motion";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [20, 30],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Glassmorphism style
const glassStyle = {
  background: "rgba(255, 255, 255, 0.67)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
};

/* ---------------------------- Utility Components ---------------------------- */

// Heatmap Layer
function HeatmapLayer({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: { 0.4: "red", 0.65: "orange", 1: "darkred" },
    }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);
  return null;
}

// Auto-fit map to GeoJSON boundary
function FitBounds({ geoJsonData }) {
  const map = useMap();
  useEffect(() => {
    if (geoJsonData) {
      const layer = L.geoJSON(geoJsonData);
      map.fitBounds(layer.getBounds());
    }
  }, [geoJsonData, map]);
  return null;
}

/* ---------------------------- Motion Variants ---------------------------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
  }),
};

/* ---------------------------- Main Component ---------------------------- */
export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Admin activity (later connect to Firestore)
  const [adminActivity] = useState([
    { id: 1, text: "Logged in", time: "10:02 AM" },
    { id: 2, text: "Reviewed patient records", time: "10:15 AM" },
    { id: 3, text: "Updated staff info", time: "11:00 AM" },
    { id: 4, text: "Generated service report", time: "11:30 AM" },
  ]);

  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auth guard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const role = userDoc.exists() ? userDoc.data().role : null;
        if (role !== "admin" || user.email !== "robert.llemit@gmail.com") {
          navigate("/");
          return;
        }
        setUsername(userDoc.data().name || "Admin");
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Load boundary GeoJSON
  useEffect(() => {
    fetch("/visayan_village.geojson")
      .then((res) => (res.ok ? res.json() : Promise.reject("GeoJSON not found")))
      .then((data) => setGeoJsonData(data))
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err);
        setGeoJsonData(null);
      });
  }, []);

  if (loading) {
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
    { text: "System Logs", icon: <SecurityIcon /> },
  ];

  // Fallback map center
  const center = [7.433123920768421, 125.78980333696956];

  // Sample data
  const heatmapPoints = [
    [7.434, 125.79, 0.8],
    [7.432, 125.792, 0.7],
    [7.431, 125.788, 0.9],
    [7.435, 125.791, 0.6],
  ];

  const patientPins = [
    { id: 1, position: [7.434, 125.79], name: "Patient A" },
    { id: 2, position: [7.432, 125.792], name: "Patient B" },
    { id: 3, position: [7.431, 125.788], name: "Patient C" },
  ];

  const events = [
    { id: 1, title: "Medical Mission", date: "Sept 30, 2025" },
    { id: 2, title: "Vaccination Drive", date: "Oct 5, 2025" },
    { id: 3, title: "Health Seminar", date: "Oct 12, 2025" },
  ];

  const medications = [
    { id: 1, name: "Amoxicillin", expiry: "2025-10-01" },
    { id: 2, name: "Paracetamol", expiry: "2025-10-15" },
    { id: 3, name: "Ibuprofen", expiry: "2025-11-01" },
  ];

  const serviceAnalytics = [
    { name: "Consultations", value: 120 },
    { name: "Vaccinations", value: 80 },
    { name: "Follow-ups", value: 40 },
  ];

  const serviceDistribution = [
    { name: "Pediatrics", value: 200 },
    { name: "General", value: 300 },
    { name: "Surgery", value: 100 },
    { name: "Maternity", value: 150 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <DashboardLayout title="Super Admin Dashboard" menuItems={menuItems}>
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
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
      </motion.div>

      {/* Stats + Map + Activity */}
      <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
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

        {/* Map + Admin Activity */}
        <Grid item xs={12} container spacing={3}>
          {/* Map */}
          <Grid item xs={12} md={8}>
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <Card sx={{ ...glassStyle, height: 500 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Patient Distribution Heatmap (Visayan Village)
                  </Typography>
                  <Box sx={{ height: "420px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
                    <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Boundary */}
                      {geoJsonData ? (
                        <>
                          <GeoJSON
                            data={geoJsonData}
                            style={{
                              color: "red",
                              weight: 3,
                              fillOpacity: 0,
                              dashArray: "8, 8",
                            }}
                            onEachFeature={(feature, layer) => {
                              layer.bindPopup("Visayan Village");
                            }}
                          />
                          <FitBounds geoJsonData={geoJsonData} />
                        </>
                      ) : (
                        <Marker position={center}>
                          <Popup>Boundary not loaded</Popup>
                        </Marker>
                      )}

                      {/* Patient markers */}
                      {patientPins.map((p) => (
                        <Marker key={p.id} position={p.position} icon={redIcon}>
                          <Popup>{p.name}</Popup>
                        </Marker>
                      ))}

                      {/* Heatmap */}
                      <HeatmapLayer points={heatmapPoints} />
                    </MapContainer>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
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

        {/* Upcoming Events + Expiring Medications */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <Card sx={glassStyle}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <EventIcon color="primary" />
                    <Typography variant="h6">Upcoming Events</Typography>
                  </Box>
                  <List>
                    {events.map((ev) => (
                      <ListItem key={ev.id}>
                        <ListItemText primary={ev.title} secondary={ev.date} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
              <Card sx={glassStyle}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <MedicationIcon color="error" />
                    <Typography variant="h6">Expiring Medications</Typography>
                  </Box>
                  <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 1 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Medicine</TableCell>
                          <TableCell>Expiry</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {medications.map((med) => (
                          <TableRow key={med.id}>
                            <TableCell>{med.name}</TableCell>
                            <TableCell>{med.expiry}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Service Analytics + Service Distribution */}
        <Grid item xs={12} container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
              <Card sx={glassStyle}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <AssignmentIcon color="success" />
                    <Typography variant="h6">Service Analytics</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={serviceAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
              <Card sx={glassStyle}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PieChartIcon color="secondary" />
                    <Typography variant="h6">Service Distribution</Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={serviceDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                      >
                        {serviceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}