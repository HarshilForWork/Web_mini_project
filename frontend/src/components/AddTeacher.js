import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Typography, Box, Paper, 
  FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput
} from "@mui/material";

function AddTeacher() {
  const [teacherData, setTeacherData] = useState({
    name: "",
    sapId: "",
    subjects: [],
    classes: []
  });
  
  // Mock data for available subjects and classes (in a real app, this would come from API)
  const [availableSubjects, setAvailableSubjects] = useState([
    { id: 1, name: "Mathematics" },
    { id: 2, name: "Physics" },
    { id: 3, name: "Computer Science" }
  ]);
  
  const [availableClasses, setAvailableClasses] = useState([
    { id: 1, name: "Computer Science A", year: "Second Year", batch: "A" },
    { id: 2, name: "Mechanical Engineering B", year: "Third Year", batch: "B" },
    { id: 3, name: "Electrical Engineering C", year: "First Year", batch: "C" }
  ]);
  
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!teacherData.name || !teacherData.sapId || teacherData.subjects.length === 0 || teacherData.classes.length === 0) {
      alert("All fields are required, including at least one subject and one class!");
      return;
    }
    
    // Here you would normally send data to backend API
    console.log("Teacher data submitted:", teacherData);
    
    // Show success message
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setTeacherData({
        name: "",
        sapId: "",
        subjects: [],
        classes: []
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Add New Teacher</Typography>
      
      {submitted ? (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#e8f5e9', mb: 3 }}>
          <Typography variant="body1">
            Teacher "{teacherData.name}" successfully added!
          </Typography>
        </Paper>
      ) : null}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Teacher Name"
          name="name"
          value={teacherData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        <TextField
          fullWidth
          label="SAP ID"
          name="sapId"
          value={teacherData.sapId}
          onChange={handleChange}
          margin="normal"
          required
        />
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="subjects-label">Subjects</InputLabel>
          <Select
            labelId="subjects-label"
            multiple
            name="subjects"
            value={teacherData.subjects}
            onChange={handleChange}
            input={<OutlinedInput label="Subjects" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const subject = availableSubjects.find(s => s.id === value);
                  return (
                    <Chip key={value} label={subject.name} />
                  );
                })}
              </Box>
            )}
          >
            {availableSubjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="classes-label">Classes</InputLabel>
          <Select
            labelId="classes-label"
            multiple
            name="classes"
            value={teacherData.classes}
            onChange={handleChange}
            input={<OutlinedInput label="Classes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const classObj = availableClasses.find(c => c.id === value);
                  return (
                    <Chip key={value} label={`${classObj.name} (${classObj.year})`} />
                  );
                })}
              </Box>
            )}
          >
            {availableClasses.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name} ({cls.year}, Batch {cls.batch})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button 
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Add Teacher
        </Button>
      </form>
    </Box>
  );
}

export default AddTeacher;
