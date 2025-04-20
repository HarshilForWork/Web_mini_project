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
    classesTaught: []
  });

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Fetch subjects and classes from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes
        const classRes = await fetch("http://localhost:5000/api/admin/classes");
        const classData = await classRes.json();
        setAvailableClasses(classData);

        // Fetch subjects
        const subjectRes = await fetch("http://localhost:5000/api/admin/subjects");
        const subjectData = await subjectRes.json();
        setAvailableSubjects(subjectData);
      } catch {
        setError("Failed to load subjects or classes.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitted(false);

    if (!teacherData.name || !teacherData.sapId || teacherData.subjects.length === 0 || teacherData.classesTaught.length === 0) {
      setError("All fields are required, including at least one subject and one class!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/add-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teacherData.name,
          sapId: teacherData.sapId,
          subjects: teacherData.subjects,         // Array of subject names
          classesTaught: teacherData.classesTaught // Array of class names
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setTeacherData({
          name: "",
          sapId: "",
          subjects: [],
          classesTaught: []
        });
      } else {
        setError(data.message || "Failed to add teacher.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Add New Teacher</Typography>

      {submitted && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: '#e8f5e9', mb: 3 }}>
          <Typography variant="body1">
            Teacher "{teacherData.name}" successfully added!
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
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {availableSubjects.map((subject) => (
              <MenuItem key={subject.subjectName} value={subject.subjectName}>
                {subject.subjectName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel id="classes-label">Classes</InputLabel>
          <Select
            labelId="classes-label"
            multiple
            name="classesTaught"
            value={teacherData.classesTaught}
            onChange={handleChange}
            input={<OutlinedInput label="Classes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {availableClasses.map((cls) => (
              <MenuItem key={cls.className} value={cls.className}>
                {cls.className} ({cls.batch})
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
