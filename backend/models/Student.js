const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sapId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    division: { type: String },
    rollNo: { type: String },
  },
  { collection: "Student_data" } // Explicitly set collection name
);

module.exports = mongoose.model("Student", studentSchema);
