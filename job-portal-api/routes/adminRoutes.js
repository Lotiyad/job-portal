const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { getAllUsers, deleteUser, getAllJobs, getApplicantsForJob, } = require("../controllers/adminController");


router.use(protect, restrictTo("admin"));

// DELETE user by admin
router.delete("/users/:userId", protect, restrictTo("admin"), deleteUser);
router.get("/users", getAllUsers);
router.get("/jobs", getAllJobs);
router.get("/jobs/:jobId/applicants", getApplicantsForJob);
module.exports = router;
