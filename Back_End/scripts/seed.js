require("dotenv").config();

const mongoose = require("mongoose");
const { Admin } = require("../models/User");

const seedSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Is Connected");

    const existAdmin = await Admin.findOne({
      email: process.env.EMAIL_ADMIN,
    });

    if (existAdmin) {
      console.log("Already Found Admin");
      return;
    }

    const newAdmin = {
      name: "Super Admin",
      email: process.env.EMAIL_ADMIN,
      password: process.env.PASSWORD_ADMIN,
      isSuperAdmin: true,
    };

    const admin = await Admin.create(newAdmin);

    console.log("Super Admin Created Successfully");
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      isSuperAdmin: admin.isSuperAdmin,
    });

  } catch (error) {
    console.error("Seed Super Admin Error:", error);

  } finally {
    await mongoose.connection.close();
    console.log("DB Is Closed");
    process.exit(0);
  }
};

seedSuperAdmin();