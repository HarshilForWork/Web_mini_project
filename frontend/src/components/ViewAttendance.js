import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  CircularProgress,
  Alert
} from "@mui/material";

function ViewAttendance() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [selectedDate, setSelectedDate] = useState("");
  const [dailyAttendance, setDailyAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDateChange = async (e) => {
    const date = e.target.value; // This will be in yyyy-mm-dd format
    setSelectedDate(date);
    
    if (!date || !user.sapId) {
      setDailyAttendance([]);
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Convert from yyyy-mm-dd to dd-mm-yyyy for backend
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      
      const response = await fetch(
        `http://localhost:5000/api/student/attendance/${user.sapId}?date=${formattedDate}`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      setDailyAttendance(data);
    } catch (err) {
      setError(err.message || "Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Check Attendance by Date
      </Typography>
      
      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3, maxWidth: 300 }}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && selectedDate && dailyAttendance.length === 0 && (
        <Alert severity="info">
          No attendance records found for {formatDate(selectedDate)}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {dailyAttendance.map((record, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderTop: `4px solid ${record.status === 'Present' ? '#4caf50' : '#f44336'}`
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {record.subject}
                </Typography>
                
                <Typography 
                  variant="subtitle1"
                  color={record.status === "Present" ? "success.main" : "error.main"}
                  fontWeight="bold"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {record.status === "Present" ? (
                    <>
                      <span style={{ fontSize: '1.2rem' }}>✓</span> Present
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: '1.2rem' }}>✗</span> Absent
                    </>
                  )}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Date: {formatDate(record.date)}
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
