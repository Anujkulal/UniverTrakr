import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBook,
  FaBookOpen,
} from "react-icons/fa";
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const backend_url = baseUrl();

const MotionCard = motion.div;

const DashboardScreen = () => {
  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  const [studentCount, setStudentCount] = React.useState(0);
  const [facultyCount, setFacultyCount] = React.useState(0);
  const [branchCount, setBranchCount] = React.useState(0);
  const [subjectCount, setSubjectCount] = React.useState(0);

  const fetchStudents = async () => {
    // setLoading(true);
    try {
      if (role === "faculty") {
        const res = await axios.get(
          `${backend_url}/faculty/students/${branchCode}`,
          {
            withCredentials: true,
          }
        );
        // console.log('Fetched students:', res.data.students.length)
        setStudentCount(res.data?.students?.length || 0);
        // setLoading(false);
        return;
      }
      const res = await axios.get(`${backend_url}/admin/students`, {
        withCredentials: true,
      });
      // console.log('Fetched students:', res.data.students.length)
      setStudentCount(res.data?.students?.length || 0);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
    // setLoading(false);
  };

  const fetchFaculties = async () => {
    // setLoading(true);
    try {
      const res = await axios.get(`${backend_url}/admin/faculty`, {
        withCredentials: true,
      });
      // console.log('Fetched faculties:', res.data.faculties)
      setFacultyCount(res.data.faculties.length || 0);
    } catch (err) {
      console.error("Error fetching faculty:", err);
    }
    // setLoading(false);
  };

  const fetchBranch = async () => {
    try {
      const response = await axios.get(
        `${backend_url}/${auth.role.toLowerCase()}/branch`,
        { withCredentials: true }
      );
      setBranchCount(response.data.branch.length || 0);
    } catch (err) {
      console.error("Failed to fetch branch:", err);
    }
  };

  const fetchSubjects = async () => {
    if (role !== "student") {
      try {
        const response = await axios.get(
          `${backend_url}/${auth.role.toLowerCase()}/subject`,
          { withCredentials: true }
        );
        setSubjectCount(response.data.subject.length || 0);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFaculties();
    fetchBranch();
    fetchSubjects();
  }, []);

  const stats = [
    {
      label: "Total Students",
      count: studentCount,
      icon: <FaUserGraduate className="text-blue-500 text-3xl" />,
    },
    {
      label: "Total Faculties",
      count: facultyCount,
      icon: <FaChalkboardTeacher className="text-green-500 text-3xl" />,
    },
    {
      label: "Total Branch",
      count: branchCount,
      icon: <FaBook className="text-yellow-500 text-3xl" />,
    },
    {
      label: "Total Subjects",
      count: subjectCount,
      icon: <FaBookOpen className="text-red-500 text-3xl" />,
    },
  ];

  // Pie chart data
  const pieData = {
    labels: ["Students", "Faculties", "Branches", "Subjects"],
    datasets: [
      {
        label: "Count",
        data: [studentCount, facultyCount, branchCount, subjectCount],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)", // blue-500
          "rgba(34, 197, 94, 0.7)", // green-500
          "rgba(253, 224, 71, 0.7)", // yellow-400
          "rgba(239, 68, 68, 0.7)", // red-500
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(253, 224, 71, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { size: 16 },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <MotionCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-5 rounded-2xl shadow-md flex items-center gap-4 hover:scale-105 transition"
          >
            <div>{stat.icon}</div>
            <div>
              <div className="text-xl font-semibold">{stat.count}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          </MotionCard>
        ))}
      </div>

      {/* Pie Chart Overview */}
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Overview Chart</h2>
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
};

export default DashboardScreen;
