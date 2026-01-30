import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobseekerDashboard from "./dashboards/JobseekerDashboard";
import EmployerDashboard from "./dashboards/EmployerDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

export default function DashboardRouter() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  switch (user.role) {
    case "jobseeker":
      return <JobseekerDashboard user={user} />;
    case "employer":
      return <EmployerDashboard user={user} />;
    case "admin":
      return <AdminDashboard user={user} />;
    default:
      return <div>Invalid user role</div>;
  }
}
