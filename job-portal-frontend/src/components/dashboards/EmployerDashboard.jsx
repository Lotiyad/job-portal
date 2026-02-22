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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Employer Dashboard</h1>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Post a New Job</h3>
          <form onSubmit={createJob} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
              <div className="mt-1">
                <input type="text" name="title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
              <div className="mt-1">
                <input type="text" name="company" id="company" value={company} onChange={(e) => setCompany(e.target.value)} required className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
              <div className="mt-1">
                <textarea id="description" name="description" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} required className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1">
                <input type="text" name="location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
              <div className="mt-1">
                <input type="text" name="salary" id="salary" value={salary} onChange={(e) => setSalary(e.target.value)} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
              </div>
            </div>

            <div className="sm:col-span-6 flex justify-end">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Job
              </button>
            </div>
          </form>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">Jobs & Applicants</h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-500">Loading jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No jobs posted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{job.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.company} • {job.location} • {job.salary && `$${job.salary}`}</p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => updateJob(job)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
                    Update
                  </button>
                  <button onClick={() => deleteJob(job._id)} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Delete
                  </button>
                </div>
              </div>
              <div className="px-4 py-5 sm:px-6 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700">{job.description}</p>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-4">Applicants ({(job.applications || []).length})</h4>
                {(job.applications || []).length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {job.applications.map((app) => (
                      <li key={app._id} className="py-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{app.applicant?.name ?? "Applicant"}</p>
                            <p className="text-sm text-gray-500 truncate">{app.applicant?.email}</p>
                            {app.coverLetter && (
                                <p className="text-xs text-gray-500 mt-1 italic">"{app.coverLetter.substring(0, 50)}..."</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                             {(app.resume || app.resumeUrl) && (
                                <span className="flex gap-2 text-sm">
                                  {/* Placeholder for resume view/download since original code had button but no implementation shown in snippet */}
                                  <span className="text-blue-600 text-xs">Resume Available</span>
                                </span>
                             )}
                            <div>
                                <label htmlFor={`status-${app._id}`} className="sr-only">Status</label>
                                <select
                                    id={`status-${app._id}`}
                                    value={app.status ?? "applied"}
                                    onChange={(e) => updateApplicationStatus(app._id, e.target.value)}
                                    className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md
                                        ${app.status === 'accepted' ? 'bg-green-50 text-green-800 border-green-200' : 
                                          app.status === 'rejected' ? 'bg-red-50 text-red-800 border-red-200' : 
                                          'bg-white'}`}
                                >
                                    {STATUS_OPTIONS.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </option>
                                    ))}
                                </select>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">No applicants yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
