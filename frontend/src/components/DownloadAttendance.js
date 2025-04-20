import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import { saveAs } from "file-saver";

function DownloadAttendance() {
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch ALL classes the teacher teaches (not just today's)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/teacher/all-classes/${user.sapId}`
        );
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data = await res.json();
        setTeacherClasses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user.sapId) fetchClasses();
  }, [user.sapId]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    const selected = teacherClasses.find((c) => c.className === e.target.value);
    setSelectedSubject(selected?.subject || "");
    setSelectedStudent("");
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setSelectedStudent("");
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleDownloadClassAttendance = async () => {
    if (!selectedClass || !selectedSubject || !startDate || !endDate) {
      alert("Please select all fields and specify the date range!");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/teacher/attendance/class?className=${encodeURIComponent(
          selectedClass
        )}&subjectName=${encodeURIComponent(
          selectedSubject
        )}&startDate=${startDate}&endDate=${endDate}&sapId=${user.sapId}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to download attendance");
      }
      const data = await res.json();
      if (data.length === 0) {
        alert("No attendance records found for the selected date range");
        return;
      }
      const csvContent = [
        "Date,SAP ID,Status",
        ...data.map((record) => `${record.date},${record.sapId},${record.status}`),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${selectedClass}_${selectedSubject}_attendance.csv`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadStudentAttendance = async () => {
    if (
      !selectedClass ||
      !selectedSubject ||
      !selectedStudent ||
      !startDate ||
      !endDate
    ) {
      alert("Please select all fields and specify the date range!");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/teacher/attendance/student?className=${encodeURIComponent(
          selectedClass
        )}&subjectName=${encodeURIComponent(
          selectedSubject
        )}&studentSapId=${encodeURIComponent(
          selectedStudent
        )}&startDate=${startDate}&endDate=${endDate}&sapId=${user.sapId}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to download attendance");
      }
      const data = await res.json();
      if (data.length === 0) {
        alert("No attendance records found for the selected student and date range");
        return;
      }
      const csvContent = [
        "Date,Status",
        ...data.map((record) => `${record.date},${record.status}`),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(
        blob,
        `${selectedClass}_${selectedSubject}_${selectedStudent}_attendance.csv`
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 3 }}>
        {error}
      </Typography>
    );
  }

  // Extract unique subjects for the selected class
  const availableSubjects = [
    ...new Set(teacherClasses
      .filter((c) => c.className === selectedClass)
      .map((c) => c.subject)),
  ];

  // Get students for the selected class
  const availableStudents =
    teacherClasses.find((c) => c.className === selectedClass)?.students || [];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Download Attendance
      </Typography>

      {/* Class Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Class</InputLabel>
        <Select value={selectedClass} onChange={handleClassChange}>
          {teacherClasses.map((cls, idx) => (
            <MenuItem key={idx} value={cls.className}>
              {cls.className}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Subject Selection */}
      <FormControl fullWidth margin="normal" disabled={!selectedClass}>
        <InputLabel>Select Subject</InputLabel>
        <Select value={selectedSubject} onChange={handleSubjectChange}>
          {availableSubjects.map((subject, idx) => (
            <MenuItem key={idx} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Student Selection */}
      <FormControl fullWidth margin="normal" disabled={!selectedSubject}>
        <InputLabel>Select Student</InputLabel>
        <Select value={selectedStudent} onChange={handleStudentChange}>
          {availableStudents.map((student) => (
            <MenuItem key={student.sapId} value={student.sapId}>
              {student.name} ({student.sapId})
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

      {/* Buttons */}
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
          disabled={
            !selectedClass ||
            !selectedSubject ||
            !selectedStudent ||
            !startDate ||
            !endDate
          }
        >
          DOWNLOAD STUDENT ATTENDANCE
        </Button>
      </Box>
    </Box>
  );
}

export default DownloadAttendance;
