const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  sapId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "teacher", "student"], required: true },
});

module.exports = mongoose.model("User", userSchema);
