import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControlLabel
} from "@mui/material";

function AddSubject() {
  const [subjectData, setSubjectData] = useState({
    subjectName: "",
    classesTaught: [],
    timings: [{ days: [], time: { start: "", end: "" } }]
  });
  const [availableClasses, setAvailableClasses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch classes from backend
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/classes");
        const data = await response.json();
        setAvailableClasses(data);
      } catch {
        setError("Failed to load classes");
      }
    };
    fetchClasses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Timing handling
  const handleTimingChange = (field, value) => {
    setSubjectData((prev) => ({
      ...prev,
      timings: [{ ...prev.timings[0], [field]: value }]
    }));
  };

  const handleDayToggle = (day) => {
    setSubjectData((prev) => {
      const days = prev.timings[0].days.includes(day)
        ? prev.timings[0].days.filter((d) => d !== day)
        : [...prev.timings[0].days, day];
      return {
        ...prev,
        timings: [{ ...prev.timings[0], days }]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !subjectData.subjectName ||
      subjectData.classesTaught.length === 0 ||
      !subjectData.timings[0].time.start ||
      !subjectData.timings[0].time.end ||
      subjectData.timings[0].days.length === 0
    ) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/admin/add-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectData)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Subject added successfully!");
        setSubjectData({
          subjectName: "",
          classesTaught: [],
          timings: [{ days: [], time: { start: "", end: "" } }]
        });
      } else {
        setError(data.message || "Failed to add subject");
      }
    } catch {
      setError("Failed to connect to server");
    }
  };

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat","Sun"];

  return (
    <Box sx={{ px: 3, py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Add New Subject</Typography>
      {success && <Typography color="success.main">{success}</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        {/* Subject Name */}
        <TextField
          fullWidth
          label="Subject Name"
          name="subjectName"
          value={subjectData.subjectName}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Classes Taught */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Select Classes</InputLabel>
          <Select
            multiple
            name="classesTaught"
            value={subjectData.classesTaught}
            onChange={handleChange}
            renderValue={(selected) => selected.join(", ")}
          >
            {availableClasses.map((cls) => (
              <MenuItem key={cls._id} value={cls.className}>
                <Checkbox checked={subjectData.classesTaught.includes(cls.className)} />
                <ListItemText primary={`${cls.className} (${cls.batch})`} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Timing */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Timing</Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="Start Time"
            value={subjectData.timings[0].time.start}
            onChange={(e) =>
              handleTimingChange("time", {
                ...subjectData.timings[0].time,
                start: e.target.value
              })
            }
            placeholder="e.g. 09:00 AM"
            required
          />
          <TextField
            label="End Time"
            value={subjectData.timings[0].time.end}
            onChange={(e) =>
              handleTimingChange("time", {
                ...subjectData.timings[0].time,
                end: e.target.value
              })
            }
            placeholder="e.g. 10:30 AM"
            required
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Days</Typography>
          {daysOfWeek.map((day) => (
            <FormControlLabel
              key={day}
              control={
                <Checkbox
                  checked={subjectData.timings[0].days.includes(day)}
                  onChange={() => handleDayToggle(day)}
                />
              }
              label={day}
            />
          ))}
        </Box>

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Add Subject
        </Button>
      </form>
    </Box>
  );
}

export default AddSubject;
