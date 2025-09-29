// Topbar.jsx
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LanguageIcon from "@mui/icons-material/Language";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Topbar({ title, open }) {
  const drawerWidth = open ? 240 : 60;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const [user, setUser] = useState(null);

  // Fetch logged-in user info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/"); // redirect to login if not logged in
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUser({ ...userDoc.data(), uid: currentUser.uid });
        } else {
          setUser({ name: "Unknown", uid: currentUser.uid });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileRedirect = () => {
    handleMenuClose();
    navigate("/superadmin/profile");
  };

  const handleToggleDarkMode = () => {
    handleMenuClose();
    alert("Toggle dark mode clicked!");
  };

  const handleHelp = () => {
    handleMenuClose();
    alert("Help clicked!");
  };

  const handleLanguage = () => {
    handleMenuClose();
    alert("Change language clicked!");
  };

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await signOut(auth); // terminate all sessions
      navigate("/"); // redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        ml: `${drawerWidth}px`,
        width: `calc(100% - ${drawerWidth}px)`,
        background: "rgba(255, 255, 255, 0.62)",
        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.18)",
        borderRadius: "0 0 20px 0",
        transition: "all 0.4s ease-in-out",
      }}
      elevation={0}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" noWrap component="div" color="black">
          {title}
        </Typography>

        <Box>
          <IconButton
            onClick={handleAvatarClick}
            size="small"
            aria-controls={openMenu ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? "true" : undefined}
            sx={{ display: "flex", alignItems: "center", gap: 0.5, p: 0 }}
          >
            <Avatar
              alt={user?.name || "User"}
              src={user?.avatar || "/path-to-avatar.png"}
            />
            <ArrowDropDownIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: "visible",
                mt: 1.5,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleProfileRedirect}>
              <Avatar sx={{ width: 24, height: 24, mr: 1 }} /> My Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleToggleDarkMode}>
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              Toggle Dark Mode
            </MenuItem>
            <MenuItem onClick={handleHelp}>
              <ListItemIcon>
                <HelpOutlineIcon fontSize="small" />
              </ListItemIcon>
              Help
            </MenuItem>
            <MenuItem onClick={handleLanguage}>
              <ListItemIcon>
                <LanguageIcon fontSize="small" />
              </ListItemIcon>
              English (US)
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}