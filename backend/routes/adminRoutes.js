const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const bcrypt = require("bcryptjs");
const parseTime = require("../utils/parseTime");

// ===================== Add Student =========================
router.post("/add-student", async (req, res) => {
  try {
    const { name, sapId, division, rollNo } = req.body;

    // Check if the class/division exists
    const classExists = await Class.findOne({ className: division });
    if (!classExists) {
      return res.status(400).json({ message: `Class/Division "${division}" does not exist.` });
    }

    // Hash password (SAP ID as default password)
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

// ===================== Add Teacher =========================
router.post("/add-teacher", async (req, res) => {
  try {
    const { name, sapId, classesTaught, subjects } = req.body;

    // 1. Validate classesTaught (divisions) exist
    const classDocs = await Class.find({ className: { $in: classesTaught } });
    const foundClassNames = classDocs.map(cls => cls.className);
    const invalidClasses = classesTaught.filter(
      cls => !foundClassNames.includes(cls)
    );
    if (invalidClasses.length > 0) {
      return res.status(400).json({
        message: `Invalid class/division(s): ${invalidClasses.join(", ")}`
      });
    }

    // 2. Validate subjects exist
    const subjectDocs = await Subject.find({ subjectName: { $in: subjects } });
    const foundSubjectNames = subjectDocs.map(subject => subject.subjectName);
    const invalidSubjects = subjects.filter(
      subject => !foundSubjectNames.includes(subject)
    );
    if (invalidSubjects.length > 0) {
      return res.status(400).json({
        message: `Invalid subject(s): ${invalidSubjects.join(", ")}`
      });
    }

    // 3. Hash password (SAP ID as default)
    const hashedPassword = await bcrypt.hash(sapId, 10);

    // 4. Create teacher
    const teacher = await Teacher.create({
      name,
      sapId,
      password: hashedPassword,
      classesTaught, // array of division/class names
      subjects       // array of subject names
    });

    // 5. Remove password from response
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
  
// ===================== Add Class =========================
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

// ===================== Add Subject (with timing clash check) =========================
router.post("/add-subject", async (req, res) => {
  try {
    const { subjectName, classesTaught, timings } = req.body;

    // Find class documents by className
    const classDocs = await Class.find({ className: { $in: classesTaught } });
    if (classDocs.length !== classesTaught.length) {
      return res.status(400).json({ message: "One or more class names are invalid" });
    }
    const classIds = classDocs.map(cls => cls._id);

    // Check for internal overlaps in new timings
    for (let i = 0; i < timings.length; i++) {
      const timingA = timings[i];
      const daysA = timingA.days;
      const startA = parseTime(timingA.time.start);
      const endA = parseTime(timingA.time.end);

      for (let j = i + 1; j < timings.length; j++) {
        const timingB = timings[j];
        const daysB = timingB.days;
        const startB = parseTime(timingB.time.start);
        const endB = parseTime(timingB.time.end);

        const commonDays = daysA.filter(day => daysB.includes(day));
        if (commonDays.length === 0) continue;

        // Check time overlap
        if (startA < endB && startB < endA) {
          return res.status(400).json({
            message: `Timing overlap in new subject for ${commonDays.join(", ")}`
          });
        }
      }
    }

    // Check overlaps with existing subjects for each class
    for (const classId of classIds) {
      const subjectsInClass = await Subject.find({ classesTaught: classId });

      for (const timing of timings) {
        const newDays = timing.days;
        const newStart = parseTime(timing.time.start);
        const newEnd = parseTime(timing.time.end);

        for (const subject of subjectsInClass) {
          for (const existingTiming of subject.timings) {
            const existingDays = existingTiming.days;
            const existingStart = parseTime(existingTiming.time.start);
            const existingEnd = parseTime(existingTiming.time.end);

            const commonDays = newDays.filter(day => existingDays.includes(day));
            if (commonDays.length === 0) continue;

            // Check time overlap
            if (newStart < existingEnd && existingStart < newEnd) {
              const className = classDocs.find(c => c._id.equals(classId)).className;
              return res.status(400).json({
                message: `Conflict in ${className}: Timing overlaps on ${commonDays.join(", ")}`
              });
            }
          }
        }
      }
    }

    // Save if no overlaps
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
