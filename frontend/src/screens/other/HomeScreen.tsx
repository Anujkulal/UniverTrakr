import Sidebar from "@/components/ui/Sidebar";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import ProfileScreen from "./ProfileScreen";
import StudentScreen from "../student/StudentScreen";
import BranchScreen from "./BranchScreen";
import NoticeScreen from "./NoticeScreen";
import FacultyScreen from "../faculty/FacultyScreen";
import TimetableScreen from "./TimetableScreen";
import SubjectScreen from "./SubjectScreen";
import DashboardScreen from "./DashboardScreen";

const HomeScreen = () => {
  const auth = JSON.parse(localStorage.getItem("user") || "{}");
    const navigate = useNavigate();

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
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <Sidebar role={auth?.role?.toLowerCase()} />
      <Routes>
          <Route index path="dashboard" element={<DashboardScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="student" element={<StudentScreen />} />
          <Route path="faculty" element={<FacultyScreen />} />
          <Route path="branch" element={<BranchScreen />} />
          <Route path="notice" element={<NoticeScreen />} />
          <Route path="timetable" element={<TimetableScreen />} />
          <Route path="subjects" element={<SubjectScreen />} />
      </Routes>
    </div>
  );
};

export default HomeScreen;
