// routes/teacherRoutes.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/Teacher");
const Subject = require("../models/Subject");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Attendance = require("../models/Attendance");

// Helper to get today's day as "Mon", "Tue", etc.
function getTodayDay() {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
}

// GET /api/teacher/today-classes/:sapId
// routes/teacherRoutes.js
router.get("/today-classes/:sapId", async (req, res) => {
    try {
      const { sapId } = req.params;
      const todayDay = getTodayDay();
  
      // 1. Find teacher
      const teacher = await Teacher.findOne({ sapId });
      if (!teacher) return res.status(404).json({ message: "Teacher not found" });
  
      // 2. Find all subjects the teacher teaches
      const subjects = await Subject.find({
        subjectName: { $in: teacher.subjects }
      });
  
      // 3. For each subject, find classes that:
      //    - The teacher is assigned to (in teacher.classesTaught)
      //    - Have a timing slot today
      let result = [];
      for (const subject of subjects) {
        // Find intersection: classes taught by teacher AND part of this subject
        const validClasses = teacher.classesTaught.filter(cls => 
          subject.classesTaught.includes(cls)
        );
  
        for (const className of validClasses) {
          // Find timing for today
          const timingToday = subject.timings.find(t => t.days.includes(todayDay));
          if (!timingToday) continue;
  
          // Get students in this class
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
  
// POST /api/teacher/mark-attendance
router.post("/mark-attendance", async (req, res) => {
    try {
      const { className, subjectName, date, classEndTime, students } = req.body;
  
      // Check if attendance already marked for this class, subject, and date
      const existing = await Attendance.findOne({ className, subjectName, date });
      
      // Get current time to check if modification is allowed (within 12 hours of class end)
      const currentTime = new Date();
      const endTime = new Date(classEndTime);
      const twelveHoursAfterClass = new Date(endTime.getTime() + (12 * 60 * 60 * 1000));
      
      if (existing) {
        // Allow modification only within 12 hours after class end
        if (currentTime > twelveHoursAfterClass) {
          return res.status(403).json({ 
            message: "Attendance can only be modified within 12 hours after class end" 
          });
        }
        
        // Update existing attendance
        existing.students = students;
        existing.lastModified = currentTime;
        await existing.save();
        return res.json({ message: "Attendance updated successfully!" });
      }
      
      // Create new attendance record
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
  
  
module.exports = router;