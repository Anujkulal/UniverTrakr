import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserShield,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaCalendarAlt,
  FaBook,
  FaBell,
  FaUniversity,
  FaClipboardList,
  FaFileAlt,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { clearAuth, logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { Button } from "../ui/Button";
import { mainAuthor, mainTitle } from "@/lib/mainTitle";

type Role = "admin" | "faculty" | "student";

interface SidebarProps {
  role?: Role;
}

const sectionMap: Record<
  Role,
  { label: string; icon: React.ReactNode; to: string }[]
> = {
  admin: [
    { label: "Profile", icon: <FaUser />, to: "/admin/profile" },
    { label: "Student", icon: <FaUserGraduate />, to: "/admin/student" },
    { label: "Faculty", icon: <FaChalkboardTeacher />, to: "/admin/faculty" },
    { label: "Branch", icon: <FaUniversity />, to: "/admin/branch" },
    { label: "Notice", icon: <FaBell />, to: "/admin/notice" },
    { label: "Timetable", icon: <FaCalendarAlt />, to: "/admin/timetable" },
    { label: "Subjects", icon: <FaBook />, to: "/admin/subjects" },
    { label: "Admins", icon: <FaUserShield />, to: "/admin/admins" },
  ],
  faculty: [
    { label: "Profile", icon: <FaUser />, to: "/faculty/profile" },
    { label: "Student", icon: <FaUserGraduate />, to: "/faculty/student" },
    { label: "Branch", icon: <FaUniversity />, to: "/faculty/branch" },
    { label: "Upload Marks", icon: <FaClipboardList />, to: "/faculty/upload-marks" },
    { label: "Timetable", icon: <FaCalendarAlt />, to: "/faculty/timetable" },
    { label: "Notice", icon: <FaBell />, to: "/faculty/notice" },
    { label: "Material", icon: <FaFileAlt />, to: "/faculty/material" },
  ],
  student: [
    { label: "Profile", icon: <FaUser />, to: "/student/profile" },
    { label: "Timetable", icon: <FaCalendarAlt />, to: "/student/timetable" },
    { label: "Marks", icon: <FaListAlt />, to: "/student/marks" },
    { label: "Materials", icon: <FaBook />, to: "/student/materials" },
    { label: "Notice", icon: <FaBell />, to: "/student/notice" },
  ],
};

// console.log(sections)
const Sidebar: React.FC<SidebarProps> = ({ role = "student" }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const sections = sectionMap[role];
  const auth = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(clearAuth())
    dispatch(logout({ role: auth.role.toLowerCase() }));
    navigate("/signin");
  };

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-gray-200 to-gray-300 text-black flex flex-col shadow-lg">
      <div className="flex flex-col items-center justify-center h-20 border-b border-zinc-300">
        <span className="text-2xl font-bold tracking-wide">{mainTitle()} </span>
        <span className="mt-2 bg-gradient-to-r from-blue-200 to-blue-300 text-sm  shadow p-1 rounded-2xl">{role}</span>
      </div>
      <nav className="flex-1 py-6 m-2">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.label}>
              <NavLink
                to={section.to}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 rounded-lg ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow"
                      : "hover:bg-blue-700 hover:text-white"
                  }`
                }
              >
                <span className="mr-3 text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <Button
          variant="destructive"
          className="flex items-center gap-2 px-6 py-3 mt-6"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </Button>
      </nav>
      <div className="p-4 text-xs text-black text-center">
        &copy; {new Date().getFullYear()} {mainTitle()} - Built by {mainAuthor()}
      </div>
    </aside>
  );
};

export default Sidebar;
