const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const bcrypt = require("bcryptjs");
const parseTime = require("../utils/parseTime");

// ===================== GET ALL CLASSES =========================
router.get("/classes", async (req, res) => {
  try {
    const classes = await Class.find({}, "className year batch");
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch classes" });
  }
});

// ===================== ADD CLASS =========================
router.post("/add-class", async (req, res) => {
  try {
    const { year, className, batch, numStudents } = req.body;
    const newClass = await Class.create({
      year: parseInt(year),
      className,
      batch,
      numStudents: parseInt(numStudents),
    });
    res.status(201).json(newClass);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Class already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// ===================== ADD STUDENT =========================
router.post("/add-student", async (req, res) => {
  try {
    const { name, sapId, division, rollNo } = req.body;

    // Check if class/division exists
    const classExists = await Class.findOne({ className: division });
    if (!classExists) {
      return res.status(400).json({ message: `Class "${division}" not found` });
    }

    // Hash password (SAP ID as default)
    const hashedPassword = await bcrypt.hash(sapId, 10);

    const student = await Student.create({
      name,
      sapId,
      password: hashedPassword,
      division,
      rollNo,
    });

    const { password, ...studentData } = student.toObject();
    res.status(201).json(studentData);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "SAP ID already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// ===================== ADD TEACHER =========================
router.post("/add-teacher", async (req, res) => {
  try {
    const { name, sapId, classesTaught, subjects } = req.body;

    // Validate classes exist
    const classDocs = await Class.find({ className: { $in: classesTaught } });
    if (classDocs.length !== classesTaught.length) {
      const foundClasses = classDocs.map(c => c.className);
      const invalid = classesTaught.filter(c => !foundClasses.includes(c));
      return res.status(400).json({ message: `Invalid classes: ${invalid.join(", ")}` });
    }

    // Validate subjects exist
    const subjectDocs = await Subject.find({ subjectName: { $in: subjects } });
    if (subjectDocs.length !== subjects.length) {
      const foundSubjects = subjectDocs.map(s => s.subjectName);
      const invalid = subjects.filter(s => !foundSubjects.includes(s));
      return res.status(400).json({ message: `Invalid subjects: ${invalid.join(", ")}` });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sapId, 10);

    const teacher = await Teacher.create({
      name,
      sapId,
      password: hashedPassword,
      classesTaught,
      subjects
    });

    const { password, ...teacherData } = teacher.toObject();
    res.status(201).json(teacherData);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "SAP ID already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

// ===================== ADD SUBJECT =========================
router.post("/add-subject", async (req, res) => {
  try {
    const { subjectName, classesTaught, timings } = req.body;

    // Validate classes exist
    const classDocs = await Class.find({ className: { $in: classesTaught } });
    if (classDocs.length !== classesTaught.length) {
      return res.status(400).json({ message: "Invalid class names" });
    }
    const classIds = classDocs.map(c => c._id);

    // Check timing conflicts
    for (const classId of classIds) {
      const subjectsInClass = await Subject.find({ classesTaught: classId });
      
      for (const subject of subjectsInClass) {
        for (const existingTiming of subject.timings) {
          for (const newTiming of timings) {
            const commonDays = existingTiming.days.filter(day => 
              newTiming.days.includes(day)
            );
            
            if (commonDays.length > 0) {
              const existingStart = parseTime(existingTiming.time.start);
              const existingEnd = parseTime(existingTiming.time.end);
              const newStart = parseTime(newTiming.time.start);
              const newEnd = parseTime(newTiming.time.end);
              
              if (newStart < existingEnd && newEnd > existingStart) {
                const className = classDocs.find(c => c._id.equals(classId)).className;
                return res.status(400).json({
                  message: `Conflict in ${className}: Timing overlaps on ${commonDays.join(", ")}`
                });
              }
            }
          }
        }
      }
    }

    const newSubject = await Subject.create({
      subjectName,
      classesTaught: classIds,
      timings: timings.map(t => ({
        days: t.days,
        time: { start: t.time.start, end: t.time.end }
      }))
    });

    res.status(201).json(newSubject);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "Subject already exists" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
});

module.exports = router;
