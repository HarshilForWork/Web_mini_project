import React, { useState } from "react";
import { TextField, Button, Typography, Box, Paper, MenuItem } from "@mui/material";

function CreateClass() {
  const [classData, setClassData] = useState({
    year: "",
    name: "",
    batch: "",
    numberOfStudents: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Year options as numbers:
  const yearOptions = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);

    if (!classData.year || !classData.name || !classData.batch || !classData.numberOfStudents) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/add-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: Number(classData.year),
          className: classData.name,
          batch: classData.batch,
          numStudents: Number(classData.numberOfStudents)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setClassData({
          year: "",
          name: "",
          batch: "",
          numberOfStudents: ""
        });
      } else {
        setError(data.message || "Failed to create class.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Create New Class</Typography>
      
      {submitted && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#e8f5e9', mb: 3 }}>
          <Typography variant="body1">
            Class {classData.name} ({classData.batch}) successfully created!
          </Typography>
        </Paper>
      )}

      {error && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#ffebee', mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Year"
          name="year"
          value={classData.year}
          onChange={handleChange}
          margin="normal"
          required
        >
          {yearOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          fullWidth
          label="Class Name"
          name="name"
          value={classData.name}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="e.g., Computer Science, Civil Engineering"
        />
        
        <TextField
          fullWidth
          label="Batch"
          name="batch"
          value={classData.batch}
          onChange={handleChange}
          margin="normal"
          required
          placeholder="e.g., A, B, Morning, Evening"
        />
        
        <TextField
          fullWidth
          type="number"
          label="Number of Students"
          name="numberOfStudents"
          value={classData.numberOfStudents}
          onChange={handleChange}
          margin="normal"
          required
          inputProps={{ min: 1 }}
        />
        
        <Button 
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Create Class
        </Button>
      </form>
    </Box>
  );
}

export default CreateClass;
