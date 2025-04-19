const mongoose = require("mongoose");

const timingSchema = new mongoose.Schema({
  days: { type: [String], required: true }, // e.g., ["Mon", "Wed"]
  time: { 
    start: { type: String, required: true }, // e.g., "09:00 AM"
    end: { type: String, required: true }    // e.g., "10:30 AM"
  }
});

const subjectSchema = new mongoose.Schema(
  {
    subjectName: { type: String, required: true, unique: true }, // e.g., "Data Structures"
    classesTaught: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    }],
    timings: [timingSchema] // Order matters (index 0 = first class timing)
  },
  { collection: "Subject_data" }
);

module.exports = mongoose.model("Subject", subjectSchema);
