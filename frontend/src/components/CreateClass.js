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

  const yearOptions = ["First Year", "Second Year", "Third Year", "Fourth Year"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData({
      ...classData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!classData.year || !classData.name || !classData.batch || !classData.numberOfStudents) {
      alert("All fields are required!");
      return;
    }
    
    // Here you would normally send data to backend API
    console.log("Class data submitted:", classData);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setClassData({
        year: "",
        name: "",
        batch: "",
        numberOfStudents: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Create New Class</Typography>
      
      {submitted ? (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#e8f5e9', mb: 3 }}>
          <Typography variant="body1">
            Class {classData.name} ({classData.batch}) successfully created!
          </Typography>
        </Paper>
      ) : null}
      
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
            <MenuItem key={option} value={option}>
              {option}
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
