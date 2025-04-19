import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, TextField, Select, MenuItem } from "@mui/material";

function Login() {
  const [step, setStep] = useState(1); // Step 1: Select Role, Step 2: Enter SAP ID and Password
  const [role, setRole] = useState("");
  const [credentials, setCredentials] = useState({
    sapId: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleRoleSelect = () => {
    if (!role) {
      alert("Please select a role!");
      return;
    }
    setStep(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleLogin = () => {
    if (!credentials.sapId || !credentials.password) {
      alert("Please enter both SAP ID and Password!");
      return;
    }

    // Mock authentication logic (replace with actual API call)
    console.log("Logging in with:", credentials);

    // Redirect to the respective dashboard based on role
    if (role === "admin") navigate("/admin");
    else if (role === "teacher") navigate("/teacher");
    else if (role === "student") navigate("/student");
  };

  return (
    <Box sx={{ maxWidth: "400px", margin: "auto", mt: 10 }}>
      {step === 1 && (
        <>
          <Typography variant="h5" gutterBottom>
            Select Your Role
          </Typography>
          <Select
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            displayEmpty
            sx={{ mb: 3 }}
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="student">Student</MenuItem>
          </Select>
          <Button variant="contained" color="primary" fullWidth onClick={handleRoleSelect}>
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Typography variant="h5" gutterBottom>
            Enter Your Credentials
          </Typography>
          <TextField
            fullWidth
            label="SAP ID"
            name="sapId"
            value={credentials.sapId}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            margin="normal"
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
            Login
          </Button>
        </>
      )}
    </Box>
  );
}

export default Login;
