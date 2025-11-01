const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coverLetter: { type: String },
  resume: { type: String }, // Path or URL to resume file
  status: { type: String, enum: ["applied", "reviewed", "accepted", "rejected"], default: "applied" }
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
