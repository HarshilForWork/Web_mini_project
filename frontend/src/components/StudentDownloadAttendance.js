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
import { saveAs } from "file-saver";

// Mock data for subjects and attendance (replace with API calls)
const subjects = ["Data Structures", "Linear Algebra", "Physics"];
const mockAttendance = {
  "Data Structures": [
    { date: "2025-04-01", status: "Present" },
    { date: "2025-04-02", status: "Absent" },
    { date: "2025-04-03", status: "Present" },
  ],
  "Linear Algebra": [
    { date: "2025-04-01", status: "Present" },
    { date: "2025-04-02", status: "Present" },
    { date: "2025-04-03", status: "Absent" },
  ],
  "Physics": [
    { date: "2025-04-01", status: "Absent" },
    { date: "2025-04-02", status: "Present" },
    { date: "2025-04-03", status: "Present" },
  ],
};

function StudentDownloadAttendance() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownloadSubjectAttendance = () => {
    if (!selectedSubject || !startDate || !endDate) {
      alert("Please select all fields and specify the date range!");
      return;
    }

    // Filter attendance data based on subject and date range (replace with API call)
    const filteredData =
      mockAttendance[selectedSubject]?.filter(
        (record) => record.date >= startDate && record.date <= endDate
      ) || [];

    // Generate CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Date,Status"]
        .concat(
          filteredData.map(
            (record) => `${record.date},${record.status}`
          )
        )
        .join("\n");

    // Download CSV file
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `${selectedSubject}_attendance.csv`);
  };

  const handleDownloadAggregateAttendance = () => {
    if (!startDate || !endDate) {
      alert("Please specify the date range!");
      return;
    }

    // Combine all attendance data (replace with API call)
    const allAttendance = Object.entries(mockAttendance).flatMap(
      ([subject, records]) =>
        records.map((record) => ({
          subject,
          ...record,
        }))
    );

    // Filter by date range
    const filteredData = allAttendance.filter(
      (record) => record.date >= startDate && record.date <= endDate
    );

    // Generate CSV content
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Subject,Date,Status"]
        .concat(
          filteredData.map(
            (record) =>
              `${record.subject},${record.date},${record.status}`
          )
        )
        .join("\n");

    // Download CSV file
    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: "text/csv;charset=utf-8;",
    });
    saveAs(blob, `aggregate_attendance.csv`);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Download Attendance
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Select Subject</InputLabel>
        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          displayEmpty
          required
        >
          {subjects.map((subject, index) => (
            <MenuItem key={index} value={subject}>
              {subject}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="From"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />
        <TextField
          label="To"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadSubjectAttendance}
          disabled={!selectedSubject || !startDate || !endDate}
        >
          DOWNLOAD SUBJECT ATTENDANCE
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadAggregateAttendance}
          disabled={!startDate || !endDate}
        >
          DOWNLOAD AGGREGATE ATTENDANCE
        </Button>
      </Box>
    </Box>
  );
}

export default StudentDownloadAttendance;
