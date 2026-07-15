import React, { useEffect } from "react";
import { Box, Container, Grid, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import SchoolIcon from "@mui/icons-material/School";
import StorageIcon from "@mui/icons-material/Storage";
import SpeedIcon from "@mui/icons-material/Speed";

const featuresList = [
  {icon: TrendingUpIcon, title: "Smart Analytics", description: "AI insights", gradient: "linear-gradient(135deg, #00d4ff, #00a8ff)"},
  {icon: SecurityIcon, title: "Security", description: "Bank-level protection", gradient: "linear-gradient(135deg, #6366f1, #4f46e5)"},
  {icon: VpnKeyIcon, title: "Real-Time Sync", description: "All devices sync", gradient: "linear-gradient(135deg, #a855f7, #9333ea)"},
  {icon: SchoolIcon, title: "Education", description: "Learn finance", gradient: "linear-gradient(135deg, #10b981, #059669)"},
  {icon: StorageIcon, title: "Cloud Backup", description: "Secure backup", gradient: "linear-gradient(135deg, #f59e0b, #d97706)"},
  {icon: SpeedIcon, title: "Lightning Fast", description: "Optimized speed", gradient: "linear-gradient(135deg, #3b82f6, #2563eb)"}
];

function FeatureCard({icon: Icon, title, description, gradient}) {
  return (
    <Box sx={{background: "rgba(26,32,53,0.9)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: "16px", p: "24px", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: 2, transition: "all 400ms", "&:hover": {boxShadow: "0 20px 60px rgba(0,212,255,0.15)", transform: "translateY(-8px)"}}}>
      <Box sx={{width: 56, height: 56, borderRadius: "12px", background: gradient, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <Icon sx={{color: "white", fontSize: 32}} />
      </Box>
      <Typography variant="h6" sx={{fontWeight: 700, color: "#e4e7ff"}}>{title}</Typography>
      <Typography variant="body2" sx={{color: "rgba(176,181,212,0.8)"}}>{description}</Typography>
    </Box>
  );
}

export default function Home() {
  const {user} = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.isAuthenticated) navigate("/dashboard");
  }, [user, navigate]);

  return (
    <Box sx={{background: "#0a0e1f", minHeight: "100vh", py: 8}}>
      <Container maxWidth="lg">
        <Box sx={{textAlign: "center", mb: 12}}>
          <Typography variant="h1" sx={{fontSize: "3.5rem", fontWeight: 900, background: "linear-gradient(135deg, #e4e7ff 0%, #00d4ff 50%, #6366f1 100%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", mb: 3}}>
            Master Your Money with AI
          </Typography>
          <Typography sx={{color: "rgba(176,181,212,0.9)", maxWidth: "600px", mx: "auto", mb: 4, fontSize: "1.05rem"}}>
            Intelligent budgeting and financial insights
          </Typography>
          <Box sx={{display: "flex", gap: 2, justifyContent: "center", mb: 6, flexWrap: "wrap"}}>
            <Button onClick={() => navigate("/register")} sx={{px: 4, py: 1.5, background: "linear-gradient(135deg, #00d4ff, #6366f1)", color: "white", fontWeight: 700}}>Get Started</Button>
            <Button onClick={() => navigate("/login")} variant="outlined" sx={{px: 4, color: "#00d4ff", borderColor: "#00d4ff"}}>Sign In</Button>
          </Box>
        </Box>
        <Grid container spacing={3}>
          {featuresList.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
