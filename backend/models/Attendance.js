const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    subjectName: { type: String, required: true },
    date: { type: String, required: true }, // e.g., "2024-05-13"
    classEndTime: { type: Date, required: true }, // Add end time of class
    lastModified: { type: Date, default: Date.now }, // Track when attendance was modified
    students: [
      {
        sapId: { type: String, required: true },
        present: { type: Boolean, required: true }
      }
    ]
  },
  { 
    collection: "attendance_data",
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
