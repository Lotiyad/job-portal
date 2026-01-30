import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate("/apply", { state: { jobId: job._id } });
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p>{job.description}</p>
      <button
        onClick={handleApply}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Apply Now
      </button>
    </div>
  );
}
