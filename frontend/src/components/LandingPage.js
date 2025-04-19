import React, { useRef } from "react";
import { Box, Button, Typography, Grid, Container } from "@mui/material";

function LandingPage() {
  // Create a reference for the "About the App" section
  const aboutSectionRef = useRef(null);

  // Scroll to the "About the App" section when Get Started is clicked
  const handleScrollToAbout = () => {
    aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url('https://source.unsplash.com/1600x900/?school,education')",
          backgroundSize: "cover",
          backgroundPosition: "center",
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

            {/* Right Section */}
            <Grid item xs={12} md={6}>
              <img
                src="https://source.unsplash.com/600x400/?classroom,students"
                alt="Attendance Portal"
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                }}
              />
            </Grid>
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
