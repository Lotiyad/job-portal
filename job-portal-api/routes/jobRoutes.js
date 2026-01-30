const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const {
  createJob,
  updateJob,
  deleteJob
} = require("../controllers/jobController");
const Job = require("../models/jobModel");

// --------------------------------------------------
// JOBSEEKER ROUTE — PUBLIC VIEW OF JOBS
// --------------------------------------------------
router.get("/public", async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// EMPLOYER ROUTE — GET MY JOBS + APPLICANTS
// --------------------------------------------------
router.get("/", protect, restrictTo("employer"), async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id })
      .populate({
        path: "applications",
        populate: { path: "applicant", select: "name email" }
      });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// EMPLOYER CRUD ROUTES
// --------------------------------------------------
router.post("/create", protect, restrictTo("employer"), createJob);
router.put("/:id", protect, restrictTo("employer"), updateJob);
router.delete("/:id", protect, restrictTo("employer"), deleteJob);

module.exports = router;
