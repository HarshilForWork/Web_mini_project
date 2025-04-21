// models/TeacherMail.js
const mongoose = require('mongoose');

const teacherMailSchema = new mongoose.Schema({
  sapId: { type: String, required: true, unique: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model('TeacherMail', teacherMailSchema);
