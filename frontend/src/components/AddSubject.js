import React, { useState } from "react";
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

function AddSubject() {
    const [subjectData, setSubjectData] = useState({
        name: "",
        classesTaught: [],
        timing: "" // Added timing field
    });

    const [availableClasses] = useState([
        { id: 1, name: "Computer Science A", year: "Second Year", batch: "A" },
        { id: 2, name: "Mechanical Engineering B", year: "Third Year", batch: "B" },
        { id: 3, name: "Electrical Engineering C", year: "First Year", batch: "C" }
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubjectData({
            ...subjectData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!subjectData.name || !subjectData.classesTaught.length || !subjectData.timing) {
            alert("All fields are required!");
            return;
        }

        console.log("Subject data submitted:", subjectData);
        alert("Subject added successfully!");

        setSubjectData({
            name: "",
            classesTaught: [],
            timing: ""
        });
    };

    return (
        <Box sx={{ px: 3, py: 2 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Add New Subject</Typography>

            <form onSubmit={handleSubmit}>
                {/* Subject Name */}
                <TextField
                    fullWidth
                    label="Subject Name"
                    name="name"
                    value={subjectData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />

                {/* Classes Taught */}
                <FormControl fullWidth margin="normal" required>
                    <InputLabel>Select Classes</InputLabel>
                    <Select
                        name="classesTaught"
                        value={subjectData.classesTaught}
                        onChange={handleChange}
                        multiple
                    >
                        {availableClasses.map((cls) => (
                            <MenuItem key={cls.id} value={cls.id}>
                                {cls.name} ({cls.year}, Batch {cls.batch})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Timing */}
                <TextField
                    fullWidth
                    label="Timing"
                    name="timing"
                    value={subjectData.timing}
                    onChange={handleChange}
                    margin="normal"
                    required
                    placeholder="e.g., 10:00 AM - 11:00 AM"
                />

                {/* Submit Button */}
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                    Add Subject
                </Button>
            </form>
        </Box>
    );
}

export default AddSubject;
