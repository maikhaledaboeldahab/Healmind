const { Patient } = require("../models/User");

const seedPatients = async () => {
  const patients = [
    {
      name: "Patient One",
      email: process.env.EMAIL_PATIENT1,
      password: process.env.PASSWORD_PATIENT1,
    },
    {
      name: "Patient Two",
      email: process.env.EMAIL_PATIENT2,
      password: process.env.PASSWORD_PATIENT2,
    },
    {
      name: "Patient Three",
      email: process.env.EMAIL_PATIENT3,
      password: process.env.PASSWORD_PATIENT3,
    },
  ];

  for (const patient of patients) {
    const existingPatient = await Patient.findOne({ email: patient.email });

    if (existingPatient) {
      console.log(`Already Found Patient: ${patient.email}`);
      continue;
    }

    await Patient.create(patient);
    console.log(`Patient Created: ${patient.email}`);
  }
};

module.exports = seedPatients;