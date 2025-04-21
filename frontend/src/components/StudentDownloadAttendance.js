import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from "@mui/material";
import { saveAs } from "file-saver";

function StudentDownloadAttendance() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects when needed
  const fetchSubjects = async () => {
    if (!user.sapId) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/subjects/${user.sapId}`
      );
      if (!res.ok) throw new Error("Failed to fetch subjects");
      const data = await res.json();
      setSubjects(data);
    } catch {
      setSubjects([]);
    }
  };

  // Fetch subjects on focus if not already loaded
  const handleSubjectFocus = () => {
    if (subjects.length === 0) fetchSubjects();
  };

  // Helper to convert yyyy-mm-dd to dd-mm-yyyy
  const toDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [yyyy, mm, dd] = dateStr.split("-");
    return [dd, mm, yyyy].join("-");
  };

  // Download overall attendance
  const handleDownloadOverall = async () => {
    if (!startDate || !endDate) {
      alert("Please select start and end date!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/attendance-report/${user.sapId}?startDate=${toDDMMYYYY(
          startDate
        )}&endDate=${toDDMMYYYY(endDate)}`
      );
      if (!res.ok) throw new Error("Failed to download attendance");
      const data = await res.json();
      if (!data.length) {
        alert("No attendance records found for the selected date range.");
        setLoading(false);
        return;
      }
      const csvContent = [
        "Date,Subject,Status",
        ...data.map((item) => `${item.date},${item.subject},${item.status}`)
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `attendance_${startDate}_to_${endDate}.csv`);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // Download subject-wise attendance
  const handleDownloadSubject = async () => {
    if (!startDate || !endDate || !subject) {
      alert("Please select subject and date range!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/student/attendance-report/${user.sapId}/${encodeURIComponent(
          subject
        )}?startDate=${toDDMMYYYY(startDate)}&endDate=${toDDMMYYYY(endDate)}`
      );
      if (!res.ok) throw new Error("Failed to download attendance");
      const result = await res.json();
      const data = result.data || [];
      if (!data.length) {
        alert("No attendance records found for the selected subject and date range.");
        setLoading(false);
        return;
      }
      const csvContent = [
        "Date,Status",
        ...data.map((item) => `${item.date},${item.status}`)
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `attendance_${subject}_${startDate}_to_${endDate}.csv`);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Download My Attendance
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Subject (optional)</InputLabel>
        <Select
          value={subject}
          label="Select Subject (optional)"
          onChange={(e) => setSubject(e.target.value)}
          onFocus={handleSubjectFocus}
        >
          <MenuItem value="">
            <em>All Subjects</em>
          </MenuItem>
          {subjects.map((subj, idx) => (
            <MenuItem key={idx} value={subj}>
              {subj}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadOverall}
          disabled={loading || !startDate || !endDate}
        >
          Download Overall Attendance
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadSubject}
          disabled={loading || !startDate || !endDate || !subject}
        >
          Download Subject Attendance
        </Button>
      </Box>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

export default StudentDownloadAttendance;
