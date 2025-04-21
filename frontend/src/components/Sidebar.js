import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";

function Sidebar({ role, setActiveComponent }) {
  // Define menu items for each role
  const menuItems = {
    admin: [
      { label: "Add Student", componentName: "addStudent" },
      { label: "Add Teacher", componentName: "addTeacher" },
      { label: "Create Class", componentName: "createClass" },
      { label: "Add Subject", componentName: "addSubject" },
    ],
    teacher: [
      { label: "Mark Attendance", componentName: "markAttendance" },
      { label: "Download Attendance", componentName: "downloadAttendance" },
      
    ],
    student: [
      { label: "View Attendance", componentName: "viewAttendance" },
      
      { label: "Download Attendance", componentName: "downloadAttendance" },
    ],
  };

  const handleLogout = () => {
    window.location.href = "/"; // Redirect to landing page
  };

  return (
    <Box
      sx={{
        width: "250px",
        backgroundColor: "#3f51b5",
        color: "#fff",
        height: "100vh",
        position: "fixed",
        paddingTop: "20px",
        paddingLeft: "10px",
      }}
    >
      {/* Sidebar Header */}
      <Typography variant="h6" sx={{ textAlign: "center", marginBottom: "20px" }}>
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </Typography>

      {/* Menu Items */}
      <List>
        {menuItems[role]?.map((item) => (
          <ListItem
            button
            key={item.componentName}
            onClick={() => setActiveComponent(item.componentName)}
            sx={{
              "&:hover": {
                backgroundColor: "#283593",
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      {/* Logout Button */}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        sx={{
          marginTop: "30px",
          backgroundColor: "#f50057",
        }}
        onClick={handleLogout}
      >
        LOGOUT
      </Button>
    </Box>
  );
}

export default Sidebar;
