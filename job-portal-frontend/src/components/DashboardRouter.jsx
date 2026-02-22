import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardRouter() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      } else {
        if (user.role === "jobseeker") navigate("/dashboard/jobseeker");
        else if (user.role === "employer") navigate("/dashboard/employer");
        else if (user.role === "admin") navigate("/dashboard/admin");
        else navigate("/");
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}
