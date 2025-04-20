const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    subjectName: { type: String, required: true },
    date: { type: String, required: true }, // e.g., "2024-05-13"
    students: [
      {
        sapId: { type: String, required: true },
        present: { type: Boolean, required: true }
      }
    ]
  },
  { collection: "attendance_data" }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
