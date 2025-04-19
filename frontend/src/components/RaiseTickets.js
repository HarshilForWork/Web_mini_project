import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

// Mock data: subjects and their conducted lecture dates
const subjectLectureDates = {
  "Data Structures": ["2025-04-10", "2025-04-12", "2025-04-15"],
  "Linear Algebra": ["2025-04-11", "2025-04-12"],
  "Physics": ["2025-04-10", "2025-04-13"],
};

const subjects = Object.keys(subjectLectureDates);

function RaiseTickets() {
  const [ticketData, setTicketData] = useState({
    subject: "",
    reason: "",
    date: "",
  });
  const [file, setFile] = useState(null);

  // Dates for the selected subject
  const availableDates = ticketData.subject
    ? subjectLectureDates[ticketData.subject]
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({
      ...ticketData,
      [name]: value,
      ...(name === "subject" ? { date: "" } : {}),
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketData.subject || !ticketData.reason || !ticketData.date) {
      alert("All fields are required!");
      return;
    }
    // Prepare form data for file upload
    const formData = new FormData();
    formData.append("subject", ticketData.subject);
    formData.append("reason", ticketData.reason);
    formData.append("date", ticketData.date);
    if (file) {
      formData.append("letter", file);
    }
    // Replace with your backend call
    console.log("Ticket data submitted:", ticketData, file);
    alert("Your ticket has been raised successfully!");
    setTicketData({ subject: "", reason: "", date: "" });
    setFile(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Raise Ticket
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Subject</InputLabel>
          <Select
            name="subject"
            value={ticketData.subject}
            onChange={handleChange}
            required
          >
            {subjects.map((subject, index) => (
              <MenuItem key={index} value={subject}>
                {subject}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Reason"
          name="reason"
          value={ticketData.reason}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
          required
        />
        {/* Date Picker: only allow available dates */}
        <TextField
          fullWidth
          label="Date"
          type="date"
          name="date"
          value={ticketData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          margin="normal"
          required
          inputProps={{
            min: availableDates.length ? availableDates[0] : undefined,
            max: availableDates.length ? availableDates[availableDates.length - 1] : undefined,
            list: "lecture-dates",
          }}
          disabled={!ticketData.subject}
          helperText={
            !ticketData.subject
              ? "Select subject first"
              : "Only dates when the lecture was conducted are allowed"
          }
        />
        {/* Datalist for available dates */}
        <datalist id="lecture-dates">
          {availableDates.map((date) => (
            <option key={date} value={date} />
          ))}
        </datalist>
        {/* File Upload and Submit Buttons in line */}
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button
            variant="outlined"
            component="label"
          >
            Upload Letter (PDF/JPG/PNG)
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit Ticket
          </Button>
        </Box>
        {file && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {file.name}
          </Typography>
        )}
      </form>
    </Box>
  );
}

export default RaiseTickets;
