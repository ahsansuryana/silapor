import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "../pages/Splash.tsx";
import Login from "../pages/Login.tsx";
import AuthCallback from "../pages/AuthCallback.tsx";
import UserHome from "../pages/User/UserHome.tsx";
import CreateReport from "../pages/CreateReport.tsx";
import MyReports from "../pages/MyReports.tsx";
import ReportDetail from "../pages/ReportDetail.tsx";
import Profile from "../pages/Profile.tsx";
import Notifications from "../pages/User/Notifications.tsx";
import StaffDashboard from "../pages/staff/StaffDashboard.tsx";
import StaffReportCenter from "../pages/staff/StaffReportCenter.tsx";
import StaffManagement from "../pages/staff/StaffManagement.tsx";
import FacilityManagement from "../pages/staff/FacilityManagement.tsx";
import AdminOverview from "../pages/admin/AdminOverview.tsx";
import AdminReportCenter from "../pages/admin/AdminReportCenter.tsx";
import UserManagement from "../pages/admin/UserManagement.tsx";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useEffect, useState } from "react";

function AppRoutes() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Splash />;
  }
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/home" element={<UserHome />} />
      <Route path="/report/new" element={<CreateReport />} />
      <Route path="/reports" element={<MyReports />} />
      <Route path="/report/:id" element={<ReportDetail />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Staff routes - only STAFF */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={["STAFF"]}>
          <StaffDashboard />
        </ProtectedRoute>
      } />
      <Route path="/staff/reports" element={
        <ProtectedRoute allowedRoles={["STAFF"]}>
          <StaffReportCenter />
        </ProtectedRoute>
      } />
      
      {/* Admin only routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminOverview />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminReportCenter />
        </ProtectedRoute>
      } />
      <Route path="/admin/management" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <StaffManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/facility" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <FacilityManagement />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <UserManagement />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes;