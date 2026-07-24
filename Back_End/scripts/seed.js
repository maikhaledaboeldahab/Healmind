// require dotenv
require("dotenv").config();
// require mongoose
const mongoose = require("mongoose");
// Admin Model
const {Admin} = require("../models/User");
// Create New Function(Server)
const seedSuperAdmin = async () => {
  try {
    // DB Connected
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Is Connected");
    // exist Admin
    const existAdmin = await Admin.findOne({
      email: process.env.EMAIL_ADMIN,
    });
    if (existAdmin) return console.log("Already Found Admin");
    // Create New Admin
    const newAdmin = {
      Name: "Super Admin",
      email: process.env.EMAIL_ADMIN,
      password: process.env.PASSWORD_ADMIN,
    };

    const admin = await Admin.create(newAdmin);

    console.log(admin);
  } catch (error) {
    console.log(error);
  } finally {
    await mongoose.connection.close();
    console.log("DB Is Closed");
    process.exit(0);
  }
};
// Run Function
seedSuperAdmin();
