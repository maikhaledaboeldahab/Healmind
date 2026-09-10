const { Doctor } = require("../models/User");

const seedDoctors = async () => {
  const doctors = [
    {
      name: "Doctor One",
      email: process.env.EMAIL_DOCTOR1,
      password: process.env.PASSWORD_DOCTOR1,
      NationalId: "HM-NAT-001",
      specialization: "Psychiatry",
      certificate: "healmind-doctor-1-certificate",
      licenseNumber: "HM-DOC-001",
      yearsOfExperience: 8,
      isApproved: true,
      approvalStatus: "approved",
    },
    {
      name: "Doctor Two",
      email: process.env.EMAIL_DOCTOR2,
      password: process.env.PASSWORD_DOCTOR2,
      NationalId: "HM-NAT-002",
      specialization: "Clinical Psychology",
      certificate: "healmind-doctor-2-certificate",
      licenseNumber: "HM-DOC-002",
      yearsOfExperience: 6,
      isApproved: true,
      approvalStatus: "approved",
    },
    {
      name: "Doctor Three",
      email: process.env.EMAIL_DOCTOR3,
      password: process.env.PASSWORD_DOCTOR3,
      NationalId: "HM-NAT-003",
      specialization: "Behavioral Therapy",
      certificate: "healmind-doctor-3-certificate",
      licenseNumber: "HM-DOC-003",
      yearsOfExperience: 5,
      isApproved: true,
      approvalStatus: "approved",
    },
  ];

  for (const doctor of doctors) {
    const existingDoctor = await Doctor.findOne({ email: doctor.email });

    if (existingDoctor) {
      console.log(`Already Found Doctor: ${doctor.email}`);
      continue;
    }

    await Doctor.create(doctor);
    console.log(`Doctor Created: ${doctor.email}`);
  }
};

module.exports = seedDoctors;