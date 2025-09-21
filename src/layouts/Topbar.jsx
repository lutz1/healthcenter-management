// Topbar.jsx
import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Topbar({ title, open }) {
  // ✅ sync width with Sidebar (240 expanded, 60 collapsed)
  const drawerWidth = open ? 240 : 60;

  return (
    <AppBar
      position="fixed"
      sx={{
        ml: `${drawerWidth}px`, // ✅ shifts to the right when sidebar expands
        width: `calc(100% - ${drawerWidth}px)`, // ✅ shrinks/grows with sidebar
        background: "rgba(255, 255, 255, 0.62)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "0 0 20px 0", // ✅ only bottom-right rounded
        transition: "all 0.4s ease-in-out", // ✅ smooth animation
      }}
      elevation={0}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" color="black">
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}