const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ------------------------
// Ensure uploads directory exists
// ------------------------
const uploadsDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ------------------------
// Multer setup for resume
// ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
    }
  }
});

// Middleware to handle single resume file
exports.uploadResume = upload.single("resume");

// ------------------------
// Apply for a job
// ------------------------
exports.applyJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const resumeFile = req.file; // resume uploaded via multer

    console.log("Application submission data:", { jobId, coverLetter: coverLetter?.substring(0, 100), hasResume: !!resumeFile });

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    if (!coverLetter) {
      return res.status(400).json({ message: "Cover letter is required" });
    }

    if (!resumeFile) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existingApplication)
      return res.status(400).json({ message: "You have already applied for this job" });

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: resumeFile.path, // save resume path
    });
    
    await Job.findByIdAndUpdate(jobId, { $push: { applications: application._id } });
    
    console.log("Application created successfully:", application._id);
    
    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (err) {
    console.error("Application submission error:", err);
    
    // Handle specific multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File size too large. Maximum size is 5MB" });
    }
    
    if (err.message.includes('Only PDF, DOC, and DOCX files are allowed')) {
      return res.status(400).json({ message: err.message });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    
    res.status(500).json({ message: "Server error during application submission" });
  }
};
// ------------------------
// Jobseeker: view my applications
// ------------------------
exports.myApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title company description location");

    // Add resume URL if exists
    const applicationsWithResumeUrl = applications.map(app => ({
      _id: app._id,
      job: app.job,
      coverLetter: app.coverLetter,
      status: app.status,
      resumeUrl: app.resume ? `${req.protocol}://${req.get("host")}/${app.resume.replace("\\", "/")}` : null,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));

    res.json({ applications: applicationsWithResumeUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};// ------------------------
// Employer: view applicants for a specific job
// ------------------------
exports.viewApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view applications for this job" });
    }

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email role");

    const applicationsWithResumeUrl = applications.map(app => ({
      _id: app._id,
      applicant: app.applicant,
      coverLetter: app.coverLetter,
      status: app.status,
      resumeUrl: app.resume ? `${req.protocol}://${req.get("host")}/${app.resume.replace("\\", "/")}` : null,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));

    res.json({ job: job.title, applications: applicationsWithResumeUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ------------------------
// Employer: update application status
// ------------------------
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["applied", "reviewed", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find application
    const application = await Application.findById(applicationId).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Only the employer who posted the job can update status
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    // Update status
    application.status = status;
    await application.save();

    res.json({ message: "Application status updated", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
