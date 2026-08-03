const mongoose = require("mongoose");
require("dotenv").config(); // Ensure you have your .env loaded if using process.env.MONGO_URI

// 1. Import your models (adjust the paths to match your project structure)
const { User, Patient, Doctor, Admin } = require("../models/User"); // Or User, depending on what you named it
const Session = require("../models/session.model"); // Adjust the path if necessary
const seedDB = async () => {
  try {
    // 2. Connect to the database
    const MONGO_URI =
      process.env.MONGO_URI || "mongodb://localhost:27017/doctor-db";
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // 3. Fetch real doctors and patients from the database
    const doctors = await Doctor.find().limit(2);
    const patients = await Patient.find().limit(2);

    // Safety check: ensure we actually have users to attach to sessions
    if (doctors.length === 0 || patients.length === 0) {
      console.error(
        "❌ Error: You need at least 1 Doctor and 1 Patient in the database to seed sessions.",
      );
      process.exit(1);
    }

    // Grab their real IDs (fallback to the first one if there is only 1 in the database)
    // Grab the entire document so we have access to BOTH _id and name
    const doc1 = doctors[0];
    const doc2 = doctors[1] ? doctors[1] : doctors[0];

    const pat1 = patients[0];
    const pat2 = patients[1] ? patients[1] : patients[0];

    // 4. Build the session data with the real IDs
    const sessionsData = [
      {
        patientId: pat1._id,
        patientname: pat1.name,
        doctorId: doc1._id,
        doctorname: doc1.name,
        type: "urgent",
        mode: "chat",
        scheduledTime: new Date(),
        status: "pending",
        depositAmount: 0,
        depositPaid: false,
      },
      {
        patientId: pat2._id,
        patientname: pat2.name,
        doctorId: doc2._id,
        doctorname: doc2.name,
        type: "followup",
        mode: "visit",
        scheduledTime: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
        status: "confirmed",
        depositAmount: 50,
        depositPaid: true,
        location: {
          address: "123 Medical Center, Building B, Room 402",
        },
      },
      {
        patientId: pat1._id,
        patientname: pat1.name,
        doctorId: doc2._id,
        doctorname: doc2.name,
        type: "followup",
        mode: "visit",
        scheduledTime: new Date(new Date().setDate(new Date().getDate() - 5)), // 5 days ago
        status: "completed",
        depositAmount: 100,
        depositPaid: true,
        location: {
          address: "456 Health St, Clinic A",
        },
        prescription: "Take 500mg Amoxicillin twice daily for 7 days.",
        report: {
          Diagnosis: "Mild Bacterial Infection",
          Notes:
            "Patient reported fatigue and mild fever. Prescribed antibiotics.",
          Followup_recommendation: "Come back in one week if symptoms persist.",
        },
      },
      {
        patientId: pat2._id,
        patientname: pat2.name,
        doctorId: doc2._id,
        doctorname: doc2.name,
        type: "urgent",
        mode: "chat",
        scheduledTime: null,
        status: "cancelled",
        depositAmount: 20,
        depositPaid: false,
      },
    ];

    // 5. Clear existing sessions and insert the new ones
    await Session.deleteMany({});
    console.log("Cleared existing sessions...");

    await Session.insertMany(sessionsData);
    console.log(
      "✅ Successfully seeded Sessions with real Doctor and Patient IDs!",
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    // 6. Close the connection
    mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

// Run the seeder
seedDB();
