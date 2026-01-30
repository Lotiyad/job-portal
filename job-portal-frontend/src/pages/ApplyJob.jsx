import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function ApplyJob() {
  const { state } = useLocation(); // Get jobId from navigation state
  const jobId = state?.jobId;

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobId) {
      setError("Job ID is missing. Please go back and try again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
      formData.append("jobId", jobId);

      await axios.post("http://localhost:5000/api/applications/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage("Application submitted successfully!");
      setError("");
      setCoverLetter("");
      setResume(null);
    } catch (err) {
      setError(err.response?.data?.message || "Application failed.");
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Apply for Job</h2>
        {message && <p className="text-green-600 text-center">{message}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            placeholder="Cover Letter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-3 border rounded-lg h-28 resize-none"
            required
          />

          <input
            type="file"
            onChange={(e) => setResume(e.target.files[0])}
            className="w-full p-3 border rounded-lg"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
