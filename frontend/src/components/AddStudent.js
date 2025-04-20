import React, { useState, useEffect } from "react";
import { 
  TextField, Button, Typography, Box, Paper, 
  FormControl, InputLabel, Select, MenuItem, CircularProgress 
} from "@mui/material";

function AddStudent() {
  const [studentData, setStudentData] = useState({
    name: "",
    rollNo: "",
    sapId: "",
    classId: ""
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch classes from backend on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/classes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setAvailableClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({
      ...studentData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!studentData.name || !studentData.rollNo || !studentData.sapId || !studentData.classId) {
      setError("All fields are required!");
      return;
    }

    // Find the selected class
    const selectedClass = availableClasses.find(cls => cls._id === studentData.classId);
    if (!selectedClass) {
      setError("Selected class not found!");
      return;
    }

    // Prepare payload
    const payload = {
      name: studentData.name,
      sapId: studentData.sapId,
      rollNo: studentData.rollNo,
      division: selectedClass.className // Use the correct field name from your Class model
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setStudentData({ name: "", rollNo: "", sapId: "", classId: "" });
      } else {
        setError(data.message || "Failed to add student.");
      }
    } catch (err) {
      setError("Failed to connect to server.");
    }
  };

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add New Student
      </Typography>

      {submitted && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#e8f5e9", mb: 3 }}>
          <Typography variant="body1">Student added successfully!</Typography>
        </Paper>
      )}

      {error && (
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#ffebee", mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={studentData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Roll Number"
            name="rollNo"
            value={studentData.rollNo}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="SAP ID"
            name="sapId"
            value={studentData.sapId}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Select Class</InputLabel>
            <Select
              name="classId"
              value={studentData.classId}
              onChange={handleChange}
              label="Select Class"
            >
              {availableClasses.map((cls) => (
                <MenuItem key={cls._id} value={cls._id}>
                  {cls.className} ({cls.year}, Batch {cls.batch})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Add Student
          </Button>
        </form>
      )}
    </Box>
  );
}

export default AddStudent;
