require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Attendance_Portal",
    });

    const adminExists = await Admin.findOne({ sapId: "admin" });
    if (adminExists) {
      console.log("Admin already exists in Admin_data collection");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin", 10);
    await Admin.create({
      name: "Admin",
      sapId: "admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully in Admin_data collection");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();
