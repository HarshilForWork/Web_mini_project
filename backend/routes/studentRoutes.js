const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Attendance = require('../models/Attendance');  
const Ticket = require('../models/Ticket');         
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const TeacherMail = require('../models/TeacherMail');
const transporter = require('../utils/mailer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = path.join(__dirname, '../uploads/');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    cb(null, allowedTypes.includes(file.mimetype));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET attendance for specific date
router.get("/attendance/:sapId", async (req, res) => {
  try {
    const { sapId } = req.params;
    const { date } = req.query;

    if (!date || !/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      return res.status(400).json({ message: "Invalid date format. Use dd-mm-yyyy" });
    }

    const [dd, mm, yyyy] = date.split('-');
    const isoDate = `${yyyy}-${mm}-${dd}`;

    const records = await Attendance.find({
      date: isoDate,
      "students.sapId": sapId
    }).select("date students subjectName");

    const attendanceList = records.flatMap(record => {
      const student = record.students.find(s => s.sapId === sapId);
      return student ? [{
        date: record.date,
        subject: record.subjectName,
        status: student.present ? "Present" : "Absent"
      }] : [];
    });

    res.json(attendanceList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET subjects for student's class
router.get('/subjects/:sapId', async (req, res) => {
  try {
    const student = await Student.findOne({ sapId: req.params.sapId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const teachers = await Teacher.find({ classesTaught: student.division });
    const subjects = [...new Set(teachers.flatMap(t => t.subjects))];
    
    res.status(200).json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST raise attendance ticket
router.post('/raise-ticket', upload.single('letter'), async (req, res) => {
  try {
    const { subject, reason, date } = req.body;
    const studentId = req.query.sapId;

    // Validation
    if (!subject || !reason || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const student = await Student.findOne({ sapId: studentId });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const teacher = await Teacher.findOne({ 
      classesTaught: student.division,
      subjects: subject 
    });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const teacherMail = await TeacherMail.findOne({ sapId: teacher.sapId });
    if (!teacherMail?.email) return res.status(404).json({ message: 'Teacher email missing' });

    // Create ticket
    const ticket = new Ticket({
      studentId,
      studentName: student.name,
      class: student.division,
      subject,
      reason,
      date,
      filePath: req.file?.path,
      fileOriginalName: req.file?.originalname,
      teacherId: teacher.sapId
    });
    await ticket.save();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: teacherMail.email,
      subject: `Attendance Request - ${subject}`,
      html: `
        <h3>Attendance Request</h3>
        <p>Student: ${student.name} (${studentId})</p>
        <p>Class: ${student.division}</p>
        <p>Subject: ${subject}</p>
        <p>Date: ${date}</p>
        <p>Reason: ${reason}</p>
        ${req.file ? `<p>Attachment: ${req.file.originalname}</p>` : ''}
      `,
      attachments: req.file ? [{
        filename: req.file.originalname,
        path: req.file.path
      }] : []
    });

    res.status(201).json({ 
      message: 'Request submitted successfully',
      ticketId: ticket._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET overall attendance between dates
router.get('/attendance-report/:sapId', async (req, res) => {
  try {
    const { sapId } = req.params;
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate || !/^\d{2}-\d{2}-\d{4}$/.test(startDate) || !/^\d{2}-\d{2}-\d{4}$/.test(endDate)) {
      return res.status(400).json({ message: "Invalid date format. Use dd-mm-yyyy" });
    }

    // Convert dates to ISO format
    const isoStart = convertToISO(startDate);
    const isoEnd = convertToISO(endDate);

    // Find attendance records
    const records = await Attendance.find({
      date: { $gte: isoStart, $lte: isoEnd },
      "students.sapId": sapId
    }).select("date students subjectName");

    // Process records
    const attendanceData = records.flatMap(record => {
      const student = record.students.find(s => s.sapId === sapId);
      return student ? [{
        date: record.date,
        subject: record.subjectName,
        status: student.present ? "Present" : "Absent"
      }] : [];
    });

    res.json(attendanceData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET subject-wise attendance between dates
router.get('/attendance-report/:sapId/:subject', async (req, res) => {
  try {
    const { sapId, subject } = req.params;
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate || !/^\d{2}-\d{2}-\d{4}$/.test(startDate) || !/^\d{2}-\d{2}-\d{4}$/.test(endDate)) {
      return res.status(400).json({ message: "Invalid date format. Use dd-mm-yyyy" });
    }

    // Convert dates to ISO format
    const isoStart = convertToISO(startDate);
    const isoEnd = convertToISO(endDate);

    // Find attendance records for specific subject
    const records = await Attendance.find({
      date: { $gte: isoStart, $lte: isoEnd },
      "students.sapId": sapId,
      subjectName: subject
    }).select("date students subjectName");

    // Process records
    const attendanceData = records.flatMap(record => {
      const student = record.students.find(s => s.sapId === sapId);
      return student ? [{
        date: record.date,
        status: student.present ? "Present" : "Absent"
      }] : [];
    });

    res.json({
      subject,
      data: attendanceData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to convert dd-mm-yyyy to yyyy-mm-dd
function convertToISO(dateStr) {
  const [dd, mm, yyyy] = dateStr.split('-');
  return `${yyyy}-${mm}-${dd}`;
}


module.exports = router;
