// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2E7DFF" }, // hospital blue accent
    secondary: { main: "#00BFA6" }, // teal accent
    background: {
      default: "#F3F4F6", // ✅ light gray background
      paper: "#FFFFFF", // floating white cards
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h6: { fontWeight: 600 },
    h5: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)", // soft floating shadows
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#FFFFFF",
          color: "#1E2A3A",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#FFFFFF",
          borderRight: "1px solid #E5E7EB",
        },
      },
    },
  },
});

export default theme;