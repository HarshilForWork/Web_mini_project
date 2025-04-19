import React, { useState } from "react";
import { Box, Typography, Grid, Card, CardContent, TextField } from "@mui/material";

// Mock function to fetch attendance for a particular day (replace with API call)
const fetchAttendanceByDate = (date) => {
  // Example: On 2025-04-12, present in Data Structures and Physics, absent in Linear Algebra
  if (date === "2025-04-12") {
    return [
      { subject: "Data Structures", status: "Present" },
      { subject: "Linear Algebra", status: "Absent" },
      { subject: "Physics", status: "Present" },
    ];
  }
  // Example: On 2025-04-13, absent in all
  if (date === "2025-04-13") {
    return [
      { subject: "Data Structures", status: "Absent" },
      { subject: "Linear Algebra", status: "Absent" },
      { subject: "Physics", status: "Absent" },
    ];
  }
  // Default: No records
  return [];
};

function ViewAttendance() {
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyAttendance, setDailyAttendance] = useState([]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setDailyAttendance(fetchAttendanceByDate(date));
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Check Attendance for a Particular Day
      </Typography>
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={2}>
        {selectedDate && dailyAttendance.length === 0 && (
          <Typography sx={{ ml: 2, mt: 2 }}>
            No attendance record found for this date.
          </Typography>
        )}
        {dailyAttendance.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{item.subject}</Typography>
                <Typography
                  color={item.status === "Present" ? "green" : "red"}
                  fontWeight="bold"
                >
                  {item.status}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ViewAttendance;
