const express = require("express");
const router = express.Router();
const path = require("path");
const {
  applyJob,
  myApplications,
  viewApplications,
  updateApplicationStatus,
  uploadResume,
} = require("../controllers/applicationController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// ---------------------------
// Jobseeker Routes
// ---------------------------

// Apply for a job (with resume upload)
router.post(
  "/apply",
  protect,
  restrictTo("jobseeker"),
  uploadResume,
  applyJob
);

// View my applications
router.get(
  "/my-applications",
  protect,
  restrictTo("jobseeker"),
  myApplications
);

// ---------------------------
// Employer Routes
// ---------------------------

// View applicants for a specific job
router.get(
  "/job/:jobId",
  protect,
  restrictTo("employer"),
  viewApplications
);

// Update application status
router.put(
  "/:applicationId/status",
  protect,
  restrictTo("employer"),
  updateApplicationStatus
);

// ---------------------------
// Download resume
// ---------------------------
router.get(
  "/resume/:applicationId",
  protect,
  restrictTo("employer"),
  async (req, res) => {
    const { applicationId } = req.params;
    const Application = require("../models/applicationModel");
    const Job = require("../models/jobModel");

    const application = await Application.findById(applicationId).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Only the employer who posted the job can download the resume
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const resumePath = path.resolve(application.resume);
    res.download(resumePath);
  }
);

module.exports = router;
