import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { saveAs } from "file-saver"; // For downloading files

// Mock data (replace with API calls)
const teacherClasses = [
  {
    id: 1,
    className: "Computer Science A",
    subject: "Data Structures",
    students: [
      { id: 1, name: "John Doe", sapId: "SAP001", rollNo: "CS101" },
      { id: 2, name: "Jane Smith", sapId: "SAP002", rollNo: "CS102" },
    ],
  },
];

function DownloadAttendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSubject(""); // Reset subject when class changes
    setSelectedStudent(""); // Reset student when class changes
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedStudent(""); // Reset student when subject changes
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleDownloadClassAttendance = () => {
    if (!selectedClass || !selectedSubject || !startDate || !endDate) {
      alert("Please select all fields and specify the date range!");
      return;
    }

    // Mock attendance data (replace with API call)
    const attendanceData = [
      { date: "2023-09-01", studentName: "John Doe", status: "Present" },
      { date: "2023-09-02", studentName: "Jane Smith", status: "Absent" },
      { date: "2023-09-03", studentName: "John Doe", status: "Present" },
    ];

    // Filter attendance data based on date range
    const filteredData = attendanceData.filter(
      (record) => record.date >= startDate && record.date <= endDate
    );

    // Generate CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,Student Name,Status"]
        .concat(
          filteredData.map(
            (record) => `${record.date},${record.studentName},${record.status}`
          )
        )
        .join("\n");

    // Download CSV file
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `${selectedClass}_${selectedSubject}_attendance.csv`);
  };

  const handleDownloadStudentAttendance = () => {
    if (!selectedClass || !selectedSubject || !selectedStudent || !startDate || !endDate) {
      alert("Please select all fields and specify the date range!");
      return;
    }

    // Mock attendance data (replace with API call)
    const attendanceData = [
      { date: "2023-09-01", status: "Present" },
      { date: "2023-09-02", status: "Absent" },
      { date: "2023-09-03", status: "Present" },
    ];

    // Filter attendance data based on date range
    const filteredData = attendanceData.filter(
      (record) => record.date >= startDate && record.date <= endDate
    );

    // Generate CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,Status"]
        .concat(filteredData.map((record) => `${record.date},${record.status}`))
        .join("\n");

    // Download CSV file
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `${selectedClass}_${selectedSubject}_${selectedStudent}_attendance.csv`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Download Attendance
      </Typography>

      {/* Class Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Class</InputLabel>
        <Select value={selectedClass} onChange={handleClassChange}>
          {teacherClasses.map((cls) => (
            <MenuItem key={cls.id} value={cls.className}>
              {cls.className}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subject Selection */}
      <FormControl fullWidth margin="normal" disabled={!selectedClass}>
        <InputLabel>Select Subject</InputLabel>
        <Select value={selectedSubject} onChange={handleSubjectChange}>
          {teacherClasses
            .find((cls) => cls.className === selectedClass)?.subject && (
            <MenuItem value={teacherClasses.find((cls) => cls.className === selectedClass)?.subject}>
              {teacherClasses.find((cls) => cls.className === selectedClass)?.subject}
            </MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Student Selection */}
      <FormControl fullWidth margin="normal" disabled={!selectedSubject}>
        <InputLabel>Select Student</InputLabel>
        <Select value={selectedStudent} onChange={handleStudentChange}>
          {teacherClasses
            .find((cls) => cls.className === selectedClass)
            ?.students.map((student) => (
              <MenuItem key={student.id} value={student.name}>
                {student.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* Date Range */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />
      </Box>

      {/* Buttons Positioned Opposite */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadClassAttendance}
          disabled={!selectedClass || !selectedSubject || !startDate || !endDate}
        >
          DOWNLOAD CLASS ATTENDANCE
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadStudentAttendance}
          disabled={!selectedClass || !selectedSubject || !selectedStudent || !startDate || !endDate}
        >
          DOWNLOAD STUDENT ATTENDANCE
        </Button>
      </Box>
    </Box>
  );
}

export default DownloadAttendance;
