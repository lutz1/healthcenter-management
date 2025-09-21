// DashboardLayout.jsx
import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import hospitalBg from "../assets/bg1.png"; // ✅ save your image in src/assets/

export default function DashboardLayout({ title, menuItems = [], children }) {
  // ✅ centralize sidebar state here
  const [open, setOpen] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundImage: `url(${hospitalBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      <CssBaseline />

      {/* Glass overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "rgba(255, 252, 252, 0.43)", // translucent layer
          backdropFilter: "blur(12px)", // ✅ frosted glass effect
          WebkitBackdropFilter: "blur(12px)",
          zIndex: 0,
        }}
      />

      {/* Sidebar (pass open + setOpen) */}
      <Sidebar menuItems={menuItems} open={open} setOpen={setOpen} />

      {/* Main content */}
      <Box sx={{ flexGrow: 1, position: "relative", zIndex: 1 }}>
        {/* ✅ Topbar resizes with sidebar */}
        <Topbar title={title} open={open} />
        <Box
          component="main"
          sx={{
            p: 3,
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </Box>
  );
}