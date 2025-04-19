const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { sapId, password } = req.body;

  try {
    // Check Admin_data → Teacher_data → Student_data
    let user = await Admin.findOne({ sapId });
    if (!user) user = await Teacher.findOne({ sapId });
    if (!user) user = await Student.findOne({ sapId });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, sapId: user.sapId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return user data (excluding password)
    const { password: _, ...userData } = user.toObject();
    res.json({ ...userData, token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
