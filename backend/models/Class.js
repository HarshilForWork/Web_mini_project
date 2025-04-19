const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    year: { type: Number, required: true },          // e.g., 2023
    className: { type: String, required: true },     // e.g., "SE-IT-A"
    batch: { 
      type: String, 
      required: true,
      enum: ["morning", "evening"] 
    },
    numStudents: { type: Number, required: true },   // e.g., 60
    fullName: { type: String, unique: true }         // Composite key: "2023-SE-IT-A-Morning"
  },
  { collection: "Class_data" }
);

// Pre-save hook to generate fullName
classSchema.pre("save", function(next) {
  this.fullName = `${this.year}-${this.className}-${this.batch}`;
  next();
});

module.exports = mongoose.model("Class", classSchema);
