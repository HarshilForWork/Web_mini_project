const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// Helper functions
function getTodayDay() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
}

const isValidDate = (dateString) => {
  return !isNaN(Date.parse(dateString));
};

// Get today's classes for teacher
router.get("/today-classes/:sapId", async (req, res) => {
  try {
    const { sapId } = req.params;
    const todayDay = getTodayDay();

    const teacher = await Teacher.findOne({ sapId });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const subjects = await Subject.find({
      subjectName: { $in: teacher.subjects }
    });

    let result = [];
    for (const subject of subjects) {
      const validClasses = teacher.classesTaught.filter(cls => 
        subject.classesTaught.includes(cls)
      );

      for (const className of validClasses) {
        const timingToday = subject.timings.find(t => t.days.includes(todayDay));
        if (!timingToday) continue;

        const students = await Student.find({ division: className });
        result.push({
          className,
          subject: subject.subjectName,
          timing: `${timingToday.time.start} - ${timingToday.time.end}`,
          students: students.map(s => ({
            name: s.name,
            sapId: s.sapId,
            rollNo: s.rollNo
          }))
        });
      }
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark attendance
router.post("/mark-attendance", async (req, res) => {
  try {
    const { className, subjectName, date, classEndTime, students, sapId } = req.body;

    const teacher = await Teacher.findOne({ 
      sapId,
      classesTaught: className,
      subjects: subjectName
    });

    if (!teacher) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const existing = await Attendance.findOne({ className, subjectName, date });
    const currentTime = new Date();
    const endTime = new Date(classEndTime);
    const twelveHoursAfterClass = new Date(endTime.getTime() + (12 * 60 * 60 * 1000));

    if (existing) {
      if (currentTime > twelveHoursAfterClass) {
        return res.status(403).json({ 
          message: "Attendance can only be modified within 12 hours after class end" 
        });
      }
      
      existing.students = students;
      existing.lastModified = currentTime;
      await existing.save();
      return res.json({ message: "Attendance updated successfully!" });
    }

    await Attendance.create({ 
      className, 
      subjectName, 
      date, 
      classEndTime,
      students,
      lastModified: currentTime
    });

    res.json({ message: "Attendance saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/attendance/class", async (req, res) => {
    try {
      const { className, subjectName, startDate, endDate, sapId } = req.query;
  
      // Validate inputs
      if (!className || !subjectName || !startDate || !endDate || !sapId) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
  
      // Verify teacher exists (no class schedule check)
      const teacher = await Teacher.findOne({ 
        sapId,
        classesTaught: className,
        subjects: subjectName 
      });
      if (!teacher) return res.status(403).json({ message: "Unauthorized" });
  
      // Get all attendance records in date range
      const attendance = await Attendance.find({
        className,
        subjectName,
        date: { $gte: startDate, $lte: endDate }
      }).select("date students.sapId students.present -_id");
  
      const records = attendance.flatMap(session => 
        session.students.map(student => ({
          date: session.date,
          sapId: student.sapId,
          status: student.present ? "Present" : "Absent"
        }))
      );
  
      res.json(records);
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  router.get("/attendance/student", async (req, res) => {
    try {
      const { className, subjectName, studentSapId, startDate, endDate, sapId } = req.query;
  
      // Validate inputs
      if (!className || !subjectName || !studentSapId || !startDate || !endDate || !sapId) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
  
      // Verify teacher exists (no class schedule check)
      const teacher = await Teacher.findOne({ 
        sapId,
        classesTaught: className,
        subjects: subjectName 
      });
      if (!teacher) return res.status(403).json({ message: "Unauthorized" });
  
      // Get all student attendance in date range
      const attendance = await Attendance.find({
        className,
        subjectName,
        date: { $gte: startDate, $lte: endDate },
        "students.sapId": studentSapId
      }).select("date students.$ -_id");
  
      const records = attendance.map(session => ({
        date: session.date,
        status: session.students[0].present ? "Present" : "Absent"
      }));
  
      res.json(records);
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });



  router.get("/all-classes/:sapId", async (req, res) => {
    try {
      const { sapId } = req.params;
      const teacher = await Teacher.findOne({ sapId });
      if (!teacher) return res.json([]);
  
      // Get all subjects the teacher teaches
      const subjects = await Subject.find({ subjectName: { $in: teacher.subjects } });
  
      let result = [];
      for (const subject of subjects) {
        const validClasses = teacher.classesTaught.filter(cls => subject.classesTaught.includes(cls));
        for (const className of validClasses) {
          const students = await Student.find({ division: className });
          result.push({
            className,
            subject: subject.subjectName,
            students: students.map(s => ({
              name: s.name,
              sapId: s.sapId,
              rollNo: s.rollNo
            }))
          });
        }
      }
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });
  
module.exports = router;
