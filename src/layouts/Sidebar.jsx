// Sidebar.jsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Collapse,
  Divider,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import InventoryIcon from "@mui/icons-material/Inventory";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import BadgeIcon from "@mui/icons-material/Badge";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import DescriptionIcon from "@mui/icons-material/Description";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";

// Import logo image
import MyLogo from "../assets/log.png";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const [collapse, setCollapse] = useState({
    management: true,
    records: true,
    analytics: true,
  });

  const toggleCollapse = (section) => {
    setCollapse({ ...collapse, [section]: !collapse[section] });
  };

  const menuItems = [
    {
      section: "Dashboard",
      key: "dashboard",
      items: [{ text: "Overview", icon: <DashboardIcon />, path: "/superadmin" }],
      toggleable: false,
    },
    {
      section: "Management",
      key: "management",
      items: [
        { text: "Staff", icon: <BadgeIcon />, path: "/management/staff" },
        { text: "Patients", icon: <LocalHospitalIcon />, path: "/management/patients" },
        { text: "Events", icon: <EventIcon />, path: "/management/events" },
      ],
      toggleable: true,
    },
    {
      section: "Records & Data",
      key: "records",
      items: [
        { text: "Medical Records", icon: <DescriptionIcon />, path: "/records/medical-records" },
        { text: "Services", icon: <BuildCircleIcon />, path: "/records/services" },
        { text: "Inventory", icon: <InventoryIcon />, path: "/records/inventory" },
        { text: "Logs & History", icon: <HistoryIcon />, path: "/records/logs-history" },
      ],
      toggleable: true,
    },
    {
      section: "Analytics",
      key: "analytics",
      items: [{ text: "Reports", icon: <BarChartIcon />, path: "/analytics/reports" }],
      toggleable: true,
    },
    {
      section: null,
      key: "settings",
      items: [{ text: "Settings", icon: <SettingsIcon />, path: "/settings" }],
      toggleable: false,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        transition: "width 0.4s ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? 240 : 60,
          border: "none",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
          borderRadius: "0 0 20px 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.4s ease-in-out",
        },
      }}
    >
      {/* Fixed header with logo and hamburger */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: 2,
          height: 80,
          flexShrink: 0,
        }}
      >
        {open && (
          <Box
            component="img"
            src={MyLogo}
            alt="My Logo"
            sx={{ height: 40, objectFit: "contain", alignItems: "center" }}
          />
        )}
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            transition: "transform 0.4s ease-in-out",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          <MenuIcon fontSize="medium" />
        </IconButton>
      </Box>

      <Divider />

      <Box sx={{ overflowY: "auto", flex: 1 }}>
        <List>
          {menuItems.map((menu) => (
            <Box key={menu.key}>
              {menu.section && open && (
                <ListItem
                  button={menu.toggleable}
                  onClick={menu.toggleable ? () => toggleCollapse(menu.key) : undefined}
                  sx={{
                    px: 3,
                    cursor: menu.toggleable ? "pointer" : "default",
                    "&:hover": menu.toggleable
                      ? { backgroundColor: "rgba(255,255,255,0.08)" }
                      : {},
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          fontWeight: "bold",
                          color: "text.secondary",
                          textTransform: "uppercase",
                          fontSize: 12,
                        }}
                      >
                        {menu.section}
                      </Box>
                    }
                  />
                  {menu.toggleable &&
                    (collapse[menu.key] ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>
              )}

              <Collapse
                in={menu.toggleable ? collapse[menu.key] : true}
                timeout={{ enter: 500, exit: 400 }}
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {menu.items.map((subItem, subIndex) => {
                    const listItemContent = (
                      <ListItem
                        button
                        key={subIndex}
                        onClick={() => navigate(subItem.path)}
                        sx={{
                          pl: open ? 5 : 2,
                          py: 1.2,
                          justifyContent: open ? "flex-start" : "center",
                          transition: "all 0.4s ease-in-out",
                          borderRadius: "20px",
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.79)",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            justifyContent: "center",
                            transition: "all 0.3s ease-in-out",
                            mr: open ? 1.5 : 0,
                            ...(open
                              ? {}
                              : {
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                  },
                                }),
                          }}
                        >
                          {subItem.icon}
                        </ListItemIcon>
                        {open && (
                          <ListItemText
                            primary={subItem.text}
                            sx={{ ml: 1, transition: "opacity 0.3s ease-in-out" }}
                          />
                        )}
                      </ListItem>
                    );

                    return open ? (
                      listItemContent
                    ) : (
                      <Tooltip
                        key={subIndex}
                        title={subItem.text}
                        placement="right"
                        arrow
                        enterDelay={300}
                      >
                        {listItemContent}
                      </Tooltip>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}