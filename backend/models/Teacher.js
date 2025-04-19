const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sapId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "teacher" },
    classesTaught: [{ type: String }], // Array of division/class names
    subjects: [{ type: String }]       // Array of subject names
  },
  { collection: "Teacher_data" }
);

module.exports = mongoose.model("Teacher", teacherSchema);
