import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardRouter from "./components/DashboardRouter";
import ProtectedRoute from "./components/ProtectedRoute";

import JobseekerDashboard from "./components/dashboards/JobseekerDashboard";
import EmployerDashboard from "./components/dashboards/EmployerDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";

import ApplyJob from "./pages/ApplyJob";
import Navbar from "./components/Navbar";

import { AuthProvider } from "./context/AuthContext";

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/apply/:jobId" element={<ApplyJob />} />
          
          {/* General Dashboard Route - Redirects based on role */}
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* Protected Routes for Specific Dashboards */}
          <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
            <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>

        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}
