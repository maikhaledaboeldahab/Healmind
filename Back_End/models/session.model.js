const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    patientname: {
      type: String,
    },
    doctorname: {
      type: String,

    },
    //will be buttons in front end
    type: {
      type: String,
      enum: ["urgent", "followup"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["visit", "chat", "video"], // ✅ ضفنا video كنوع جديد
      required: true,
    },
    //-----------------

    //related to the doctor availability
    scheduledTime: {
      type: Date,
      required: false, // May be null initially for some urgent flows
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "rejected"], // ✅ ضفنا rejected
      default: "pending",
      index: true,
    },
    //----------------------

    depositAmount: {
      type: Number,
      default: 0,
    },
    depositPaid: {
      type: Boolean,
      default: false,
    },
    // Physical location details for 'visit' mode
    location: {
      address: String,
    },
    prescription: {
      type: String,
      default: "",
    },
    report: {
      Diagnosis: { type: String, default: "" },
      Notes: { type: String, default: "" },
      Followup_recommendation: { type: String, default: "" },
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  },
);

module.exports = mongoose.model("Session", sessionSchema);