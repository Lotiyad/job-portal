import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function EmployerDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  const API = "http://localhost:5000";
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch jobs, then fetch applicants for each job so applicants always show
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/api/jobs`, authHeaders);
      const jobsList = res.data || [];
      const jobsWithApplicants = await Promise.all(
        jobsList.map(async (job) => {
          try {
            const appRes = await axios.get(
              `${API}/api/applications/job/${job._id}`,
              authHeaders
            );
            return { ...job, applications: appRes.data?.applications ?? [] };
          } catch {
            return { ...job, applications: job.applications ?? [] };
          }
        })
      );
      setJobs(jobsWithApplicants);
    } catch (err) {
      console.error("Error fetching jobs:", err.response?.data || err.message);
      setError("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Create a new job
  const createJob = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${API}/api/jobs/create`,
        { title, description, company, location, salary },
        authHeaders
      );
      setTitle("");
      setDescription("");
      setCompany("");
      setLocation("");
      setSalary("");
      fetchJobs();
    } catch (err) {
      console.error("Error creating job:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to create job.");
    }
  };

  // Update a job
  const updateJob = async (job) => {
    const newTitle = prompt("Enter new title:", job.title);
    const newDescription = prompt("Enter new description:", job.description);
    const newCompany = prompt("Enter new company:", job.company);
    const newLocation = prompt("Enter new location:", job.location);
    const newSalary = prompt("Enter new salary:", job.salary || "");

    if (!newTitle || !newDescription || !newCompany || !newLocation) return;

    try {
      await axios.put(
        `${API}/api/jobs/${job._id}`,
        { title: newTitle, description: newDescription, company: newCompany, location: newLocation, salary: newSalary },
        authHeaders
      );
      fetchJobs();
    } catch (err) {
      console.error("Error updating job:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update job.");
    }
  };

  // Delete a job
  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`${API}/api/jobs/${jobId}`, authHeaders);
      fetchJobs();
    } catch (err) {
      console.error("Error deleting job:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to delete job.");
    }
  };

  // Update application status
  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axios.put(
        `${API}/api/applications/${applicationId}/status`,
        { status: newStatus },
        authHeaders
      );
      fetchJobs();
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  const STATUS_OPTIONS = ["applied", "reviewed", "accepted", "rejected"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Job</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={createJob} className="space-y-3 mb-6">
        <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" required />
        <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" required />
        <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="border p-2 w-full" required />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 w-full" required />
        <input type="text" placeholder="Salary" value={salary} onChange={(e) => setSalary(e.target.value)} className="border p-2 w-full" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Create Job</button>
      </form>

      <h2 className="text-xl font-semibold mb-3">Jobs & Applicants</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        jobs.map((job) => (
          <div key={job._id} className="border p-3 rounded mb-3">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{job.title}</p>
              <div className="space-x-2">
                <button onClick={() => updateJob(job)} className="bg-yellow-500 text-white px-2 py-1 rounded">Update</button>
                <button onClick={() => deleteJob(job._id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </div>
            </div>
            <p className="mt-1">{job.description}</p>
            <p className="mt-1 text-gray-600">{job.company} – {job.location} {job.salary && `– $${job.salary}`}</p>

            <div className="mt-3 border-t pt-3">
              <h3 className="font-semibold text-gray-700 mb-2">
                Applicants ({(job.applications || []).length})
              </h3>
              {(job.applications || []).length > 0 ? (
                <div className="space-y-3">
                  {job.applications.map((app) => (
                    <div
                      key={app._id}
                      className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded border"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">
                          {app.applicant?.name ?? "Applicant"}
                        </span>
                        {app.applicant?.email && (
                          <span className="text-gray-600 text-sm ml-2">
                            ({app.applicant.email})
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 capitalize">
                        Status:
                      </span>
                      <select
                        value={app.status ?? "applied"}
                        onChange={(e) =>
                          updateApplicationStatus(app._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm capitalize bg-white"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {(app.resume || app.resumeUrl) && (
                        <span className="flex gap-2 text-sm">
                          <button
                            type="button"
                            className="text-blue-600 underline hover:no-underline"
                            onClick={async () => {
                              try {
                                const res = await axios.get(
                                  `${API}/api/applications/resume/${app._id}`,
                                  { ...authHeaders, responseType: "blob" }
                                );
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                window.open(url, "_blank", "noopener,noreferrer");
                                setTimeout(() => window.URL.revokeObjectURL(url), 60000);
                              } catch (err) {
                                setError("Failed to open resume.");
                              }
                            }}
                          >
                            View Resume
                          </button>
                          <button
                            type="button"
                            className="text-blue-600 underline hover:no-underline"
                            onClick={async () => {
                              try {
                                const res = await axios.get(
                                  `${API}/api/applications/resume/${app._id}`,
                                  { ...authHeaders, responseType: "blob" }
                                );
                                const url = window.URL.createObjectURL(new Blob([res.data]));
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `resume-${app.applicant?.name ?? "applicant"}.pdf`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                              } catch (err) {
                                setError("Failed to download resume.");
                              }
                            }}
                          >
                            Download
                          </button>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No applicants yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
