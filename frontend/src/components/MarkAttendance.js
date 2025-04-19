import React, { useState } from "react";
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
  Switch
} from "@mui/material";

// Mock data (replace with API calls)
const teacherClasses = [
  {
    id: 1,
    className: "Computer Science 1",
    subject: "Data Structures",
    timing: "10:00 AM - 11:00 AM", // Timing fetched from backend
    students: [
      { id: 1, name: "John Doe", sapId: "6009230069", rollNo: "C101" },
      { id: 2, name: "Jane Smith", sapId: "60009340069", rollNo: "C102" },
    ],
  },
  {
    id: 2,
    className: "Mech",
    subject: "Linear Algebra",
    timing: "02:00 PM - 03:00 PM", // Timing fetched from backend
    students: [
      { id: 3, name: "Bob Johnson", sapId: "60033993", rollNo: "MA201" },
    ],
  },
];

function MarkAttendance() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState("");

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);

    // Initialize attendance state
    const initialAttendance = {};
    cls.students.forEach((student) => {
      initialAttendance[student.id] = true; // default to present
    });
    setAttendance(initialAttendance);
  };

  const handleAttendanceChange = (studentId) => (e) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: e.target.checked,
    }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedDate) {
      alert("Please select a date!");
      return;
    }

    // Validate that the selected date is today or a future date
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate < today) {
      alert("You cannot mark attendance for past dates!");
      return;
    }

    // Send attendance data to backend
    console.log("Attendance submitted:", { selectedDate, attendance });
    alert("Attendance saved successfully!");

    // Reset state
    setSelectedClass(null);
    setSelectedDate("");
  };

  if (!selectedClass) {
    return (
      <div style={{ padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          Your Classes
        </Typography>
        <Grid container spacing={3}>
          {teacherClasses.map((cls) => (
            <Grid item xs={12} sm={6} md={4} key={cls.id}>
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
        Timing: {selectedClass.timing} {/* Display timing */}
      </Typography>

      {/* Date Input */}
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: new Date().toISOString().split("T")[0], // Disable past dates
        }}
        sx={{ mb: 3 }}
      />

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Roll Number</TableCell> {/* Added Roll Number Column */}
              <TableCell>SAP ID</TableCell>
              <TableCell>Present/Absent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedClass.students.map((student) => (
              <TableRow key={student.id}>
                {/* Student Name */}
                <TableCell>{student.name}</TableCell>

                {/* Roll Number */}
                <TableCell>{student.rollNo}</TableCell>

                {/* SAP ID */}
                <TableCell>{student.sapId}</TableCell>

                {/* Present/Absent Toggle */}
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={attendance[student.id] || false}
                        onChange={handleAttendanceChange(student.id)}
                        color="primary"
                      />
                    }
                    label={attendance[student.id] ? "Present" : "Absent"}
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
    </div>
  );
}

export default MarkAttendance;
