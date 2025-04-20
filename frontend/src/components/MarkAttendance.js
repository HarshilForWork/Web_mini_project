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

// Helper to convert time string to Date object
const parseTimeToDate = (timeStr, dateStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
};

function MarkAttendance() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modificationDeadline, setModificationDeadline] = useState(null);

  // Fetch today's classes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!user.sapId) {
        setError("User not found or missing SAP ID");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/teacher/today-classes/${user.sapId}`
        );
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();
        setTeacherClasses(data);
      } catch (err) {
        setError(`Failed to load classes: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [user.sapId]);

  // Handle class selection
  const handleClassSelect = (cls) => {
    const [startTime, endTime] = cls.timing.split(" - ");
    const classEndTime = parseTimeToDate(endTime, selectedDate);
    const deadline = new Date(classEndTime.getTime() + (12 * 60 * 60 * 1000));
    
    setSelectedClass(cls);
    setModificationDeadline(deadline);
    
    // Initialize attendance state
    const initialAttendance = {};
    cls.students.forEach((student) => {
      initialAttendance[student.sapId] = true;
    });
    setAttendance(initialAttendance);
  };

  // Check modification window
  useEffect(() => {
    if (!modificationDeadline) return;

    const checkTimeLimit = () => {
      const now = new Date();
      if (now > modificationDeadline) {
        setError("Attendance modification period has expired (12 hours after class end)");
        return false;
      }
      return true;
    };

    checkTimeLimit();
    const interval = setInterval(checkTimeLimit, 60000);
    return () => clearInterval(interval);
  }, [modificationDeadline]);

  // Handle attendance change
  const handleAttendanceChange = (sapId) => (e) => {
    if (new Date() > modificationDeadline) {
      setError("Attendance modification period has expired");
      return;
    }
    setAttendance(prev => ({ ...prev, [sapId]: e.target.checked }));
  };

  // Submit attendance
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      const [startTime, endTime] = selectedClass.timing.split(" - ");
      const classEndTime = parseTimeToDate(endTime, selectedDate);

      const studentsData = selectedClass.students.map(student => ({
        sapId: student.sapId,
        present: attendance[student.sapId] || false
      }));

      const res = await fetch("http://localhost:5000/api/teacher/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          className: selectedClass.className,
          subjectName: selectedClass.subject,
          date: selectedDate,
          classEndTime: classEndTime.toISOString(),
          students: studentsData,
          sapId: user.sapId // <-- THIS FIXES THE UNAUTHORIZED ERROR
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Failed to save attendance");
      
      setSuccess("Attendance saved successfully!");
      setTimeout(() => setSelectedClass(null), 1500);
    } catch (err) {
      setError(err.message || "Failed to connect to server");
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
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3}>
          {teacherClasses.map((cls, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card 
                sx={{ cursor: "pointer", "&:hover": { boxShadow: 3 } }}
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
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Button variant="outlined" onClick={() => setSelectedClass(null)} sx={{ mb: 2 }}>
        Back to Classes
      </Button>

      <Typography variant="h4" gutterBottom>
        {selectedClass.className} Attendance
      </Typography>
      
      {modificationDeadline && (
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          Modification allowed until: {new Date(modificationDeadline).toLocaleString()}
        </Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>SAP ID</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedClass.students.map((student) => (
              <TableRow key={student.sapId}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.sapId}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(attendance[student.sapId])}
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

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
        disabled={!!error}
      >
        Save Attendance
      </Button>

      {success && <Typography color="success.main">{success}</Typography>}
      {error && <Typography color="error">{error}</Typography>}
    </div>
  );
}

export default MarkAttendance;
