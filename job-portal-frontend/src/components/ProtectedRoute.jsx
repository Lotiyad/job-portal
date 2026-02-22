import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their appropriate dashboard if they try to access a restricted one
    if (user.role === "jobseeker") return <Navigate to="/dashboard/jobseeker" replace />;
    if (user.role === "employer") return <Navigate to="/dashboard/employer" replace />;
    if (user.role === "admin") return <Navigate to="/dashboard/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
