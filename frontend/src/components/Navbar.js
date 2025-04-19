import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Attendance Portal
        </Typography>
        <Tabs textColor="inherit">
          <Tab label="Login" component={Link} to="/" />
          <Tab label="Admin" component={Link} to="/admin" />
          <Tab label="Teacher" component={Link} to="/teacher" />
          <Tab label="Student" component={Link} to="/student" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
