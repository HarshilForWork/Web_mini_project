import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Checkbox,
  Button,
  Alert,
  Snackbar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

// Mock data for tickets (replace with API calls)
const initialTickets = [
  {
    id: 1,
    name: "John Doe",
    subject: "Data Structures",
    reason: "Marked absent mistakenly",
    division: "A",
    rollNo: "CS101",
  },
  {
    id: 2,
    name: "Jane Smith",
    subject: "Linear Algebra",
    reason: "Was present but marked absent",
    division: "B",
    rollNo: "CS102",
  },
  {
    id: 3,
    name: "Bob Johnson",
    subject: "Physics",
    reason: "Medical leave submitted late",
    division: "C",
    rollNo: "CS103",
  },
];

function ViewTickets() {
  const [tickets, setTickets] = useState(initialTickets);
  const [selected, setSelected] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Handle checkbox selection
  const handleSelect = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selected, id];
    } else {
      newSelected = selected.filter(item => item !== id);
    }

    setSelected(newSelected);
  };

  // Handle removing selected tickets
  const handleRemoveTickets = () => {
    if (selected.length === 0) {
      return;
    }

    // Filter out the selected tickets
    const updatedTickets = tickets.filter(ticket => !selected.includes(ticket.id));
    setTickets(updatedTickets);
    setSelected([]);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">
          View Tickets
        </Typography>
        <Button 
          variant="contained" 
          color="error" 
          startIcon={<DeleteIcon />}
          onClick={handleRemoveTickets}
          disabled={selected.length === 0}
        >
          Remove Selected Tickets
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell padding="checkbox">
                <Checkbox 
                  indeterminate={selected.length > 0 && selected.length < tickets.length}
                  checked={tickets.length > 0 && selected.length === tickets.length}
                  onChange={() => {
                    if (selected.length === tickets.length) {
                      setSelected([]);
                    } else {
                      setSelected(tickets.map(ticket => ticket.id));
                    }
                  }}
                />
              </TableCell>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Subject</strong></TableCell>
              <TableCell><strong>Reason</strong></TableCell>
              <TableCell><strong>Division</strong></TableCell>
              <TableCell><strong>Roll Number</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => {
              const isSelected = selected.indexOf(ticket.id) !== -1;
              
              return (
                <TableRow 
                  key={ticket.id}
                  hover
                  selected={isSelected}
                  onClick={() => handleSelect(ticket.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox checked={isSelected} />
                  </TableCell>
                  <TableCell>{ticket.name}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.reason}</TableCell>
                  <TableCell>{ticket.division}</TableCell>
                  <TableCell>{ticket.rollNo}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {tickets.length === 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No tickets to display
          </Typography>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Tickets successfully removed!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ViewTickets;
