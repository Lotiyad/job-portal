const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { createJob, getAllJobs, updateJob, deleteJob } = require("../controllers/jobController");

// Public route
router.get("/", getAllJobs);

// Employer-only routes
router.post("/create", protect, restrictTo("employer"), createJob);
router.put("/:id", protect, restrictTo("employer"), updateJob);
router.delete("/:id", protect, restrictTo("employer"), deleteJob);

module.exports = router;
