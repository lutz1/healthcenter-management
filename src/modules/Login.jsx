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
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/bg2.png";
import logo from "../assets/log.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => setFadeIn(true), []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;

        if (role === "admin") navigate("/admin");
        else if (role === "staff") navigate("/staff");
        else setError("Role not assigned. Please contact administrator.");
      } else {
        setError("No user profile found in database.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
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
            alignItems: "center",
          }}
        >
          <CardContent sx={{ flexGrow: 1, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Box component="img" src={logo} alt="Logo" sx={{ width: 250, height: 100, mb: 3, animation: "bounce 3s infinite" }} />

            <Box sx={{ mb: 3, textAlign: "center" }}>
              <Typography variant="h5" fontWeight="bold" color="primary" sx={{ letterSpacing: 0.5 }}>
                Greetings, Healthcare Professional
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1, fontStyle: "italic" }}>
                Access your dashboard and manage operations efficiently
              </Typography>
            </Box>

            <form onSubmit={handleLogin} style={{ width: "100%", position: "relative" }}>
              {error && (
                <Typography color="error" variant="body2" textAlign="center" sx={{ fontWeight: "bold", mb: 2 }}>
                  {error}
                </Typography>
              )}

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
                sx={{ mt: 3, py: 1.5, fontWeight: "bold", textTransform: "none" }}
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