// src/modules/Login.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  GlobalStyles,
} from "@mui/material";
import { auth, db } from "./firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg2.png";
import logo from "../assets/log.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => setFadeIn(true), []);

  const getFriendlyError = (firebaseError) => {
    switch (firebaseError.code) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/wrong-password":
        return "Incorrect password. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later.";
      case "auth/invalid-credential":
        return "Invalid credentials provided. Please check your email and password.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowError(false);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const accountType = userData.accountType;

        switch (accountType) {
          case "superadmin":
            navigate("/superadmin");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "staff":
            navigate("/staff");
            break;
          default:
            setError("Unknown account type");
            setShowError(true);
        }
      } else {
        setError("No account data found.");
        setShowError(true);
      }
    } catch (err) {
      setError(getFriendlyError(err));
      setShowError(true);
    }

    setLoading(false);
  };

  return (
    <>
      <GlobalStyles
        styles={{
          html: { height: "100%", overflow: "hidden" },
          body: { height: "100%", margin: 0, overflow: "hidden" },
          "#root": { height: "100%" },
          "*": { boxSizing: "border-box" },
        }}
      />

      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          px: 2,
          position: "relative",
        }}
      >
        <Card
          sx={{
            width: { xs: "100%", sm: 420 },
            maxHeight: "90vh",
            p: 5,
            backdropFilter: "blur(15px)",
            WebkitBackdropFilter: "blur(15px)",
            background: "rgba(255, 255, 255, 0.15)",
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            transition: "all 0.8s ease",
            opacity: fadeIn ? 1 : 0,
            transform: fadeIn ? "translateY(0)" : "translateY(20px)",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            },
            position: "relative",
            zIndex: 1,
            alignItems: "center",
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Logo */}
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: 250,
                height: 100,
                mb: 3,
                animation: "bounce 3s infinite",
              }}
            />

            {/* Professional greeting */}
            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="primary"
                sx={{ letterSpacing: 0.5 }}
              >
                Greetings, Healthcare Professional
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 1, fontStyle: "italic" }}
              >
                Access your dashboard and manage operations efficiently
              </Typography>
            </Box>

            <form onSubmit={handleLogin} style={{ width: "100%", position: "relative" }}>
              {/* Professional text error overlay */}
              <Typography
                color="error"
                variant="body2"
                textAlign="center"
                sx={{
                  fontWeight: "bold",
                  height: 24, // reserve space even when empty
                  mb: 1,
                  opacity: showError ? 1 : 0,
                  transition: "opacity 0.5s ease-in-out",
                  position: "absolute",
                  top: -28,
                  left: 0,
                  width: "100%",
                }}
              >
                {error}
              </Typography>

              <TextField
                label="Email"
                variant="filled"
                fullWidth
                required
                margin="dense"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  mb: 2,
                  "& .MuiFilledInput-root": {
                    background: "rgba(255,255,255,0.25)",
                    transition: "0.3s all",
                    "&:hover": { background: "rgba(255,255,255,0.35)" },
                    "&.Mui-focused": { background: "rgba(255,255,255,0.5)" },
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                variant="filled"
                fullWidth
                required
                margin="dense"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{ disableUnderline: true }}
                sx={{
                  mb: 2,
                  "& .MuiFilledInput-root": {
                    background: "rgba(255,255,255,0.25)",
                    transition: "0.3s all",
                    "&:hover": { background: "rgba(255,255,255,0.35)" },
                    "&.Mui-focused": { background: "rgba(255,255,255,0.5)" },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  transition: "0.3s all",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-15px); }
            60% { transform: translateY(-7px); }
          }
        `}
      </style>
    </>
  );
}