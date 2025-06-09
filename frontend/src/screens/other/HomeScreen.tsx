import Sidebar from "@/components/ui/Sidebar";
import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router";
import ProfileScreen from "./ProfileScreen";
import StudentScreen from "../student/StudentScreen";

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
          <Route index path="profile" element={<ProfileScreen />} />
          <Route path="student" element={<StudentScreen />} />
          {/* <Route index path="profile" element={<ProfileScreen />} />
          <Route index path="profile" element={<ProfileScreen />} /> */}
      </Routes>
    </div>
  );
};

export default HomeScreen;
