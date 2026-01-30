import React, { useEffect, useState } from "react";
import axios from "axios";

export default function JobSeekerDashboard({ user }) {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/public");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, []);

  // Fetch the jobseeker's applications (API returns { applications: [...] })
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications/my-applications", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setApplications(res.data?.applications ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApplications();
  }, []);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob || !selectedFile || !coverLetter) {
      setMessage("⚠️ Please select a job, upload your resume, and write a cover letter.");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", selectedJob._id);
    formData.append("resume", selectedFile);
    formData.append("coverLetter", coverLetter);

    try {
      await axios.post("http://localhost:5000/api/applications/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage("✅ Application submitted successfully!");
      setCoverLetter("");
      setSelectedFile(null);
      setSelectedJob(null);

      // Refresh applications list
      const res = await axios.get("http://localhost:5000/api/applications/my-applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApplications(res.data?.applications ?? []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting application. Try again.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center text-primary">Welcome, {user.name}</h2>
      <h4 className="text-secondary mb-3 text-center">Available Jobs</h4>

      <div className="row">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="col-md-4 mb-4">
              <div
                className={`card shadow-sm ${selectedJob?._id === job._id ? "border-primary" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedJob(job)}
              >
                <div className="card-body">
                  <h5 className="card-title text-dark">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                  <p className="card-text small text-secondary">{job.description?.substring(0, 100)}...</p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setSelectedJob(job)}
                  >
                    {selectedJob?._id === job._id ? "Selected" : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No jobs available at the moment.</p>
        )}
      </div>

      {selectedJob && (
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <h5 className="text-primary">{selectedJob.title}</h5>
            <p className="text-muted">{selectedJob.company}</p>
            <p>{selectedJob.description}</p>

            <form onSubmit={handleApply}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Cover Letter</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Upload Resume (PDF)</label>
                <input type="file" className="form-control" onChange={handleFileChange} />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2"
                style={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                🚀 Apply for this Job
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-5">
        <h4 className="text-secondary mb-3">My Applications</h4>
        <p className="text-muted small mb-3">Jobs you applied to and their current status.</p>
        {applications.length > 0 ? (
          <div className="list-group">
            {applications.map((app) => (
              <div key={app._id} className="list-group-item d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div className="flex-grow-1">
                  <strong>{app.job?.title ?? "Job"}</strong>
                  {app.job?.company && (
                    <span className="text-muted"> at {app.job.company}</span>
                  )}
                  {app.job?.description && (
                    <p className="mb-0 small text-muted mt-1">{app.job.description.substring(0, 100)}...</p>
                  )}
                  {app.coverLetter && (
                    <p className="mb-0 small mt-1"><em>Cover letter:</em> {app.coverLetter.substring(0, 80)}...</p>
                  )}
                </div>
                <span
                  className={`badge text-nowrap ${
                    app.status === "accepted"
                      ? "bg-success"
                      : app.status === "rejected"
                      ? "bg-danger"
                      : app.status === "reviewed"
                      ? "bg-info"
                      : "bg-warning"
                  }`}
                >
                  {app.status?.toUpperCase() ?? "APPLIED"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No applications yet. Select a job above and apply to see your applications and status here.</p>
        )}
      </div>

      {message && (
        <div className="mt-3 alert alert-info text-center fw-semibold">{message}</div>
      )}
    </div>
  );
}
