import Sidebar from "@/components/ui/Sidebar";
import React, { useEffect, type JSX } from "react";
import { Route, Routes, useNavigate } from "react-router";
import ProfileScreen from "./ProfileScreen";
import StudentScreen from "../student/StudentScreen";
import BranchScreen from "./BranchScreen";
import NoticeScreen from "./NoticeScreen";
import FacultyScreen from "../faculty/FacultyScreen";
import TimetableScreen from "./TimetableScreen";
import SubjectScreen from "./SubjectScreen";
import DashboardScreen from "./DashboardScreen";
import AdminScreen from "../admin/AdminScreen";
import NotFound from "./NotFound";
import MarksScreen from "./MarksScreen";
import MaterialScreen from "./MaterialScreen";

const HomeScreen = () => {
  const auth = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();
    const role = auth?.role?.toLowerCase();

  // Redirect if not authenticated
  useEffect(() => {
    // console.log("Checking window location:", window.location)
    if (!auth || !auth.userId) {
      if (window.location.pathname !== "/signin") {
        console.error("No user data found, redirecting to sign-in page.");
        navigate("/signin", { replace: true });
      }
    }
  }, [auth, navigate]);

  // Define allowed routes for each role
  const routesByRole: Record<string, JSX.Element[]> = {
    admin: [
      <Route index path="dashboard" element={<DashboardScreen />} key="dashboard" />,
      <Route path="profile" element={<ProfileScreen />} key="profile" />,
      <Route path="student" element={<StudentScreen />} key="student" />,
      <Route path="faculty" element={<FacultyScreen />} key="faculty" />,
      <Route path="branch" element={<BranchScreen />} key="branch" />,
      <Route path="notice" element={<NoticeScreen />} key="notice" />,
      <Route path="timetable" element={<TimetableScreen />} key="timetable" />,
      <Route path="subjects" element={<SubjectScreen />} key="subjects" />,
      <Route path="admins" element={<AdminScreen />} key="admins" />,
    ],
    faculty: [
      <Route index path="profile" element={<ProfileScreen />} key="profile" />,
      <Route path="student" element={<StudentScreen />} key="student" />,
      <Route path="upload-marks" element={<MarksScreen />} key="upload-marks" />,
      <Route path="timetable" element={<TimetableScreen />} key="timetable" />,
      <Route path="notice" element={<NoticeScreen />} key="notice" />,
      <Route path="material" element={<MaterialScreen />} key="material" />,
    ],
    student: [
      <Route index path="profile" element={<ProfileScreen />} key="profile" />,
      <Route path="timetable" element={<TimetableScreen />} key="timetable" />,
      <Route path="marks" element={<MarksScreen />} key="marks" />,
      <Route path="materials" element={<MaterialScreen />} key="materials" />,
      <Route path="notice" element={<NoticeScreen />} key="notice" />,
    ],
  };
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar role={role} />
      <Routes>
        { routesByRole[role] || null }
        <Route path="*" element={<NotFound />} />
          
      </Routes>
    </div>
  );
};

export default HomeScreen;
