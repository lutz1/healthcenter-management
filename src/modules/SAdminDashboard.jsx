// src/modules/SuperAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
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

// Layout
import DashboardLayout from "../layouts/DashboardLayout";

// Leaflet
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Polygon,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const glassStyle = {
  background: "rgba(255, 255, 255, 0.67)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255, 255, 255, 0.3)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
};

// Heatmap Layer
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const heatLayer = L.heatLayer(points, { radius: 25, blur: 15, maxZoom: 17 }).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

// --- Helper: Flip [lng, lat] → [lat, lng] recursively ---
function flipCoords(coords) {
  if (typeof coords[0] === "number") {
    return [coords[1], coords[0]];
  }
  return coords.map(flipCoords);
}

function fixGeoJson(data) {
  return {
    ...data,
    features: data.features.map((f) => ({
      ...f,
      geometry: {
        ...f.geometry,
        coordinates: flipCoords(f.geometry.coordinates),
      },
    })),
  };
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [geoJsonData, setGeoJsonData] = useState(null);

  // Real-time clock
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auth & restrict only Robert
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

  // Load uploaded GeoJSON boundary
  useEffect(() => {
    fetch("/visayan_village.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("GeoJSON not found");
        return res.json();
      })
      .then((data) => {
        if (data.features && data.features.length > 0) {
          setGeoJsonData(fixGeoJson(data));
        } else {
          setGeoJsonData(null); // fallback later
        }
      })
      .catch((err) => {
        console.error("Failed to load GeoJSON:", err);
        setGeoJsonData(null);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
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

  // Approximate center of Visayan Village
  const center = [7.433123920768421, 125.78980333696956];

  // Sample heatmap points
  const heatmapPoints = [
    [7.434, 125.79, 0.8],
    [7.432, 125.792, 0.7],
    [7.431, 125.788, 0.9],
    [7.435, 125.791, 0.6],
  ];

  // Sample patient pins (just using same coords as heatmap for now)
  const patientPins = [
    { id: 1, pos: [7.434, 125.79], name: "Patient A" },
    { id: 2, pos: [7.432, 125.792], name: "Patient B" },
    { id: 3, pos: [7.431, 125.788], name: "Patient C" },
  ];

  // Fallback boundary polygon
  const fallbackBoundary = [
    [7.437, 125.785],
    [7.437, 125.795],
    [7.430, 125.795],
    [7.430, 125.785],
    [7.437, 125.785], // close
  ];

  return (
    <DashboardLayout title="Super Admin Dashboard" menuItems={menuItems}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        px={2}
      >
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

      {/* Stats + Map */}
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

        {/* Map */}
        <Grid item xs={12}>
          <Card sx={{ ...glassStyle, height: 500 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Patient Distribution Heatmap (Visayan Village)
              </Typography>
              <Box
                sx={{
                  height: "420px",
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <MapContainer
                  center={center}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Use GeoJSON if valid, otherwise fallback polygon */}
                  {geoJsonData ? (
                    <GeoJSON
                      data={geoJsonData}
                      style={{
                        color: "red",
                        weight: 3,
                        fillOpacity: 0,
                        dashArray: "8, 8",
                      }}
                    />
                  ) : (
                    <Polygon
                      positions={fallbackBoundary}
                      pathOptions={{
                        color: "red",
                        weight: 3,
                        fillOpacity: 0,
                        dashArray: "8, 8",
                      }}
                    />
                  )}

                  {/* Heatmap Layer */}
                  <HeatmapLayer points={heatmapPoints} />

                  {/* Patient Pins */}
                  {patientPins.map((p) => (
                    <Marker key={p.id} position={p.pos}>
                      <Popup>{p.name}</Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}