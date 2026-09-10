const { Patient, Doctor } = require("../models/User");
const Session = require("../models/session.model");

const seedSessions = async () => {
    const doctors = await Doctor.find().sort({ createdAt: 1 }).limit(2);
    const patients = await Patient.find().sort({ createdAt: 1 }).limit(2);

    // Safety check: ensure we actually have users to attach to sessions
    if (doctors.length === 0 || patients.length === 0) {
      throw new Error(
        "You need at least 1 Doctor and 1 Patient in the database to seed sessions.",
      );
    }

    const doc1 = doctors[0];
    const doc2 = doctors[1] || doctors[0];

    const pat1 = patients[0];
    const pat2 = patients[1] || patients[0];

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

    await Session.deleteMany({});
    console.log("Cleared existing sessions...");

    await Session.insertMany(sessionsData);
    console.log(
      "✅ Successfully seeded Sessions with real Doctor and Patient IDs!",
    );
};

module.exports = seedSessions;
