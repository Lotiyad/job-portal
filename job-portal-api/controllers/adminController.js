const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
// Admin: delete a user (employer or jobseeker)
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent admin from deleting themselves or another admin
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete another admin" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: `User ${user.name} (${user.role}) has been removed.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Admin: get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Exclude password from response
    const users = await User.find().select("-password");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin: view all jobs
exports.getAllJobs = async (req, res) => {
  try {
    let jobs = await Job.find()
      .populate("createdBy", "name email role")
      .lean(); // convert to plain JS object so we can add fields

    // Add applicant count for each job
    for (let job of jobs) {
      job.applicantCount = await Application.countDocuments({ job: job._id });
    }

    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// ------------------------
// Admin: view all applicants for a specific job
// ------------------------
exports.getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applications = await Application.find({ job: jobId })
      .populate("applicant", "name email role")
      .populate("job", "title");

    if (!applications.length) {
  return res.json({ applications: [] });   // return empty list, NOT an error
}


    const applicationsWithResumeUrl = applications.map(app => ({
      _id: app._id,
      applicant: app.applicant,
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
};