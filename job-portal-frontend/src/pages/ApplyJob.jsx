import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingJob, setLoadingJob] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;
      try {
        // Attempt to fetch specific job. If this endpoint doesn't exist, we might need to fallback.
        // Assuming GET /api/jobs/:id is available publicly or for authenticated users.
        // If not, we might need to rely on passed state or fetch all and filter.
        // For now, let's try to fetch all public jobs and find the one.
        // This is safer if we don't know the exact backend route for single job.
        const res = await axios.get("http://localhost:5000/api/jobs/public");
        const foundJob = res.data.find(j => j._id === jobId);
        if (foundJob) {
          setJob(foundJob);
        } else {
          setError("Job not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load job details.");
      } finally {
        setLoadingJob(false);
      }
    };
    fetchJob();
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobId) {
      setError("Job ID is missing. Please go back and try again.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (resume) {
        formData.append("resume", resume);
      }
      formData.append("jobId", jobId);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to apply.");
        setIsSubmitting(false);
        return;
      }

      await axios.post("http://localhost:5000/api/applications/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Application submitted successfully!");
      setCoverLetter("");
      setResume(null);
      // Optional: Redirect after success
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Application failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Apply for {job ? job.title : "this Job"}
        </h2>
        {job && (
          <p className="mt-2 text-center text-lg text-gray-600">
            at <span className="font-semibold">{job.company}</span>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {message && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

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

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                Cover Letter
              </label>
              <div className="mt-1">
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={5}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Tell us why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                Resume (PDF, DOCX)
              </label>
              <div className="mt-1">
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
