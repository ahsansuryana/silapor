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

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center space-y-4">
        <h1 className="font-headline font-extrabold text-6xl text-primary">404</h1>
        <p className="font-body text-on-surface-variant">Halaman tidak ditemukan</p>
        <a href="/home" className="inline-block px-6 py-3 bg-primary text-white rounded-xl font-headline font-bold">Kembali ke Home</a>
      </div>
    </div>
  );
}

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
      
      {/* Authenticated routes - requires any valid login */}
      <Route path="/home" element={
        <ProtectedRoute allowedRoles={["MAHASISWA", "STAFF", "ADMIN"]}>
          <UserHome />
        </ProtectedRoute>
      } />
      <Route path="/report/new" element={
        <ProtectedRoute allowedRoles={["MAHASISWA", "STAFF", "ADMIN"]}>
          <CreateReport />
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute allowedRoles={["MAHASISWA", "STAFF", "ADMIN"]}>
          <MyReports />
        </ProtectedRoute>
      } />
      <Route path="/report/:id" element={
        <ProtectedRoute allowedRoles={["MAHASISWA", "STAFF", "ADMIN"]}>
          <ReportDetail />
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute allowedRoles={["MAHASISWA", "STAFF", "ADMIN"]}>
          <Notifications />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={["MAHASISWA", "STAFF", "ADMIN"]}>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Staff routes */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>
          <StaffManagement />
        </ProtectedRoute>
      } />
      <Route path="/staff/dashboard" element={
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

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
