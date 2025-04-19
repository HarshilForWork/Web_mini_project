import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name: "",
    rollNo: "",
    sapId: "",
    classId: "" // Added classId field to track selected class
  });
  const [submitted, setSubmitted] = useState(false);

  // Mock data for available classes (ensure this is defined)
  const [availableClasses] = useState([
    { id: 1, name: "Computer Science A", year: "Second Year", batch: "A" },
    { id: 2, name: "Mechanical Engineering B", year: "Third Year", batch: "B" },
    { id: 3, name: "Electrical Engineering C", year: "First Year", batch: "C" }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (!studentData.name || !studentData.rollNo || !studentData.sapId || !studentData.classId) {
      alert("All fields are required!");
      return;
    }

    // Here you would normally send data to backend API
    console.log("Student data submitted:", studentData);

    // Show success message
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setStudentData({
        name: "",
        rollNo: "",
        sapId: "",
        classId: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add New Student
      </Typography>

      {submitted ? (
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#e8f5e9", mb: 3 }}>
          <Typography variant="body1">
            Student "{studentData.name}" successfully added to class!
          </Typography>
        </Paper>
      ) : null}

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <TextField
          fullWidth
          label="Full Name"
          name="name"
          value={studentData.name}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Roll Number */}
        <TextField
          fullWidth
          label="Roll Number"
          name="rollNo"
          value={studentData.rollNo}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* SAP ID */}
        <TextField
          fullWidth
          label="SAP ID"
          name="sapId"
          value={studentData.sapId}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Class Dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Select Class</InputLabel>
          <Select
            name="classId"
            value={studentData.classId}
            onChange={handleChange}
            label="Select Class"
          >
            {availableClasses.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name} ({cls.year}, Batch {cls.batch})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Add Student
        </Button>
      </form>
    </Box>
  );
}

export default AddStudent;
