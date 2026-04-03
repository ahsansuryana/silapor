import { Routes, Route, Navigate } from "react-router-dom";
import Splash from "../pages/Splash.tsx";
import Login from "../pages/Login.tsx";
import UserHome from "../pages/User/UserHome.tsx";
import CreateReport from "../pages/CreateReport.tsx";
import MyReports from "../pages/MyReports.tsx";
import ReportDetail from "../pages/ReportDetail.tsx";
import Profile from "../pages/Profile.tsx";
import StaffDashboard from "../pages/staff/StaffDashboard.tsx";
import StaffReportCenter from "../pages/staff/StaffReportCenter.tsx";
import StaffManagement from "../pages/staff/StaffManagement.tsx";
import FacilityManagement from "../pages/staff/FacilityManagement.tsx";
import Broadcast from "../pages/staff/Broadcast.tsx";
import AdminOverview from "../pages/admin/AdminOverview.tsx";
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
      <Route path="/home" element={<UserHome />} />
      <Route path="/report/new" element={<CreateReport />} />
      <Route path="/reports" element={<MyReports />} />
      <Route path="/report/:id" element={<ReportDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/staff" element={<StaffDashboard />} />
      <Route path="/staff/reports" element={<StaffReportCenter />} />
      <Route path="/staff/management" element={<StaffManagement />} />
      <Route path="/staff/facility" element={<FacilityManagement />} />
      <Route path="/staff/broadcast" element={<Broadcast />} />
      <Route path="/admin" element={<AdminOverview />} />
    </Routes>
  );
}

export default AppRoutes;
