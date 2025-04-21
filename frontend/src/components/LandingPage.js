import React, { useRef } from "react";
import { Box, Button, Typography, Grid, Container } from "@mui/material";

function LandingPage() {
  const aboutSectionRef = useRef(null);

  const handleScrollToAbout = () => {
    aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#000", // Solid black background
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ textShadow: "2px 2px 5px rgba(0,0,0,0.7)" }}>
                Welcome to the Attendance Portal
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}>
                A seamless way to manage attendance for students, teachers, and admins.
              </Typography>
              <Box mt={4}>
                <Button
                  onClick={handleScrollToAbout}
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ marginRight: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  href="/login"
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  Login
                </Button>
              </Box>
            </Grid>

            {/* Right Section - intentionally left blank */}
            <Grid item xs={12} md={6}></Grid>
          </Grid>
        </Container>
      </Box>

      {/* About the App Section */}
      <Box ref={aboutSectionRef} sx={{ padding: "50px", backgroundColor: "#f9f9f9", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          About the Attendance Portal
        </Typography>
        <Typography variant="body1">
          This app is designed to simplify attendance management for schools and colleges. It provides separate dashboards for students,
          teachers, and administrators:
        </Typography>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li> Students can view their attendance and raise tickets for corrections.</li>
          <li> Teachers can mark attendance and respond to student tickets.</li>
          <li> Admins can manage users, classes, and subjects efficiently.</li>
        </ul>
      </Box>
    </Box>
  );
}

export default LandingPage;
