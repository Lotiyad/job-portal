import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../JobCard";
import { useAuth } from "../../context/AuthContext";

export default function JobSeekerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs/public");
        setJobs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch the jobseeker's applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        
        const res = await axios.get("http://localhost:5000/api/applications/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data?.applications ?? []);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) {
        fetchApplications();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Welcome back, <span className="text-blue-600">{user?.name || "Job Seeker"}</span>
              </h2>
              <p className="mt-2 text-lg text-gray-500">
                Find your next career move or check your application status.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
               {/* Could add a 'Update Profile' button here later */}
            </div>
          </div>
        </div>

        {/* Available Jobs Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Latest Opportunities
            </h3>
            {/* Could add a 'View All' link here */}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white h-64 rounded-xl shadow-sm animate-pulse"></div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
              <p className="mt-1 text-sm text-gray-500">Check back later for new opportunities.</p>
            </div>
          )}
        </div>

        {/* My Applications Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Application History
          </h3>
          
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
            {applications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{app.job?.title ?? "Unknown Job"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{app.job?.company ?? "Unknown Company"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {/* Assuming createdAt exists, otherwise fallback */}
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "Recent"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              app.status === 'reviewed' ? 'bg-purple-100 text-purple-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {app.status?.toUpperCase() ?? "APPLIED"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start applying to jobs to see your history here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
