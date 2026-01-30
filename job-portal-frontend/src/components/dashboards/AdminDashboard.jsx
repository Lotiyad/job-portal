import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // Fetch users and jobs on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, jobRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/jobs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(
  userRes.data?.data ||
  userRes.data?.users ||
  userRes.data ||
  []
);

setJobs(
  jobRes.data?.data ||
  jobRes.data?.jobs ||
  jobRes.data ||
  []
);

      } catch (err) {
        console.error(err);
        setError(
          "Failed to load data. Check backend routes, token, or permissions."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Delete user
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };

  // View job applicants
  const handleViewApplicants = async (jobId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/jobs/${jobId}/applicants`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedJob({ id: jobId, applicants: res.data.applications });

    } catch (err) {
      alert("Failed to fetch applicants.");
      console.error(err);
    }
  };

  const closeModal = () => setSelectedJob(null);

  if (loading)
    return <p className="text-center mt-5 text-muted">Loading dashboard...</p>;

  if (error)
    return <div className="alert alert-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">Admin Dashboard</h2>

      <div className="row">
        {/* Users Section */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Registered Users</h5>
            </div>
            <div className="card-body">
              {users.length > 0 ? (
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`badge ${
                              user.role === "admin"
                                ? "bg-danger"
                                : user.role === "employer"
                                ? "bg-warning text-dark"
                                : "bg-success"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No users found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Job Listings</h5>
            </div>
            <div className="card-body">
              {jobs.length > 0 ? (
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Applicants</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job, index) => (
                      <tr key={job._id}>
                        <td>{index + 1}</td>
                        <td>{job.title}</td>
                        <td>{job.company}</td>
                        <td>{job.applicantCount}</td>

                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleViewApplicants(job._id)}
                          >
                            View
                          </button>
                          {/* Delete button removed */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No jobs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Modal */}
      {selectedJob && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Applicants</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {selectedJob.applicants.length > 0 ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Cover Letter</th>
                        <th>Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedJob.applicants.map((app, index) => (
                        <tr key={index}>
                          <td>{app.applicant?.name || "N/A"}</td>
                          <td>{app.applicant?.email || "N/A"}</td>

                          <td>{app.coverLetter || "N/A"}</td>
                          <td>
                           {app.resumeUrl ? (
  <a
    href={app.resumeUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="btn btn-sm btn-outline-success"
  >
    View Resume
  </a>
) : "N/A"}

                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-muted">No applicants found for this job.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
