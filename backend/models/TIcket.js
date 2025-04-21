// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: String, required: true },
  filePath: { type: String },
  fileOriginalName: { type: String },
  status: { type: String, default: 'pending' },
  teacherId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
