import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
  CircularProgress,
  Box
} from "@mui/material";

function MarkAttendance() {
  const user = JSON.parse(localStorage.getItem("user")); // Assumes user object with sapId
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch today's classes for this teacher on mount
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/teacher/today-classes/${user.sapId}`
        );
        const data = await res.json();
        setTeacherClasses(data);
      } catch {
        setError("Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [user.sapId]);

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    // Initialize attendance state
    const initialAttendance = {};
    cls.students.forEach((student) => {
      initialAttendance[student.sapId] = true; // default to present
    });
    setAttendance(initialAttendance);
    setSuccess("");
    setError("");
  };

  const handleAttendanceChange = (sapId) => (e) => {
    setAttendance((prev) => ({
      ...prev,
      [sapId]: e.target.checked,
    }));
  };

  // Only allow today's date
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!selectedDate) {
      setError("Please select a date!");
      return;
    }
    if (selectedDate !== today) {
      setError("You can only mark attendance for today!");
      return;
    }

    // Prepare student attendance data
    const studentsAttendance = selectedClass.students.map((student) => ({
      sapId: student.sapId,
      present: attendance[student.sapId] || false,
    }));

    try {
      const res = await fetch(
        "http://localhost:5000/api/teacher/mark-attendance",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            className: selectedClass.className,
            subjectName: selectedClass.subject,
            date: selectedDate,
            students: studentsAttendance,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess("Attendance saved successfully!");
        setTimeout(() => {
          setSelectedClass(null);
          setSuccess("");
        }, 1500);
      } else {
        setError(data.message || "Failed to save attendance.");
      }
    } catch {
      setError("Failed to connect to server.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!selectedClass) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          Your Classes for Today
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {teacherClasses.length === 0 ? (
          <Typography>No classes scheduled for today.</Typography>
        ) : (
          <Grid container spacing={3}>
            {teacherClasses.map((cls, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                  }}
                  onClick={() => handleClassSelect(cls)}
                >
                  <CardContent>
                    <Typography variant="h6">{cls.className}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {cls.subject}
                    </Typography>
                    <Typography variant="body2">
                      Timing: {cls.timing}
                    </Typography>
                    <Typography variant="body2">
                      Students: {cls.students.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        onClick={() => setSelectedClass(null)}
        sx={{ mb: 2 }}
      >
        Back to Classes
      </Button>

      {/* Class and Subject Info */}
      <Typography variant="h4" gutterBottom>
        Mark Attendance - {selectedClass.className}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Subject: {selectedClass.subject}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Timing: {selectedClass.timing}
      </Typography>

      {/* Date Input */}
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        disabled
        InputLabelProps={{
          shrink: true,
        }}
        sx={{ mb: 3 }}
      />

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>SAP ID</TableCell>
              <TableCell>Present/Absent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedClass.students.map((student, idx) => (
              <TableRow key={idx}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.rollNo}</TableCell>
                <TableCell>{student.sapId}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendance[student.sapId] || false}
                        onChange={handleAttendanceChange(student.sapId)}
                        color="primary"
                      />
                    }
                    label={attendance[student.sapId] ? "Present" : "Absent"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Save Attendance Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Save Attendance
      </Button>
      {success && (
        <Typography color="success.main" sx={{ mt: 2 }}>
          {success}
        </Typography>
      )}
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export default MarkAttendance;
