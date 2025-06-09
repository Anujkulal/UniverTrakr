import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import H2 from "@/components/ui/H2";
import EditStudent from "./EditStudent";
import MessageBar from "@/components/ui/MessageBar";
import { Input } from "@/components/ui/Input";

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

interface Student {
  _id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  enrollmentNo: string;
  branch: string;
  email: string;
  phoneNumber: string;
  semester: string;
  gender: string;
  profile?: string;
  [key: string]: any;
}

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [message, setMessage] = useState<{type: "success" | "error"; text: string} | null >(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend_url}/admin/students`, {
        withCredentials: true,
      });
      // console.log('Fetched students:', res.data.students)
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
    setLoading(false);
  };

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleEdit = (student: Student) => {
    setEditStudent(student);
  };

  const handleCloseEdit = (updated?: boolean) => {
    setEditStudent(null);
    if (updated) fetchStudents(); // Refresh the list if updated
  };

  const handleDelete = async (enrollmentNo: string, firstName: string, lastName: string) => {
    if (!window.confirm(`Are you sure you want to remove student: "${firstName} ${lastName}"?`)) {
      return;
    }
    try {
      const res = await axios.delete(`${backend_url}/admin/students/${enrollmentNo}`, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: res.data.message });
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
      setMessage({ type: "error", text: "Failed to delete student. Please try again." });
    }
  }

  const filteredStudents = students.filter((student) => {
    return student.enrollmentNo.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            student.firstName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            student.branch.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <MessageBar variant={message?.type} message={message?.text || ''} onClose={() => setMessage(null)}/>
      <H2 className="text-blue-700">Students List</H2>
      <div className="mb-4">
      
        <Input
        type="search"
        placeholder="Search by Enrollment No, Name or Branch..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-blue-100"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredStudents.length === 0 ? (
        <span>Students not found!</span>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* <input type="search" name="" id="" placeholder="search here..."/> */}
          <table className="w-full text-left">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Enrollment No</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <React.Fragment key={student._id}>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-medium">
                      {student.firstName} {student.middleName || ""}{" "}
                      {student.lastName}
                    </td>
                    <td className="px-4 py-3">{student.enrollmentNo}</td>
                    <td className="px-4 py-3">{student.branch}</td>
                    <td className="px-4 py-3 flex gap-4">
                      <Button
                        variant={expanded === student._id ? "outline" : "plain"}
                        onClick={() => handleExpand(student._id)}
                      >
                        {expanded === student._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-600 focus:ring-green-500"
                        onClick={() => handleEdit(student)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(student.enrollmentNo, student.firstName, student.lastName)}
                      >
                        <MdDeleteForever />
                      </Button>
                    </td>
                  </tr>
                  {/* AnimatePresence + motion for dropdown details */}
                  <AnimatePresence>
                    {expanded === student._id && (
                      <motion.tr
                        className="bg-blue-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <td colSpan={4} className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {student.profile && (
                              <div>
                                <img
                                  src={`${base_url}/media/student/${student.profile}?v=${student.updatedAt || Date.now()}`} 
                                  // Force the image to reload by appending a cache-busting query string (e.g., a timestamp or Date.now()) to the image URL.

                                  alt="Profile"
                                  className="w-16 h-16 rounded-full border-2 border-indigo-300 mt-2"
                                />
                              </div>
                            )}
                            <div>
                              <span className="font-semibold">Email:</span>{" "}
                              {student.email}
                            </div>
                            <div>
                              <span className="font-semibold">Phone:</span>{" "}
                              {student.phoneNumber}
                            </div>
                            <div>
                              <span className="font-semibold">Semester:</span>{" "}
                              {student.semester}
                            </div>
                            <div>
                              <span className="font-semibold">Gender:</span>{" "}
                              {student.gender}
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit student modal  */}
      <AnimatePresence>
        {editStudent && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditStudent
              fetchStudents={fetchStudents}
              student={editStudent}
              onClose={handleCloseEdit}
              setMessage={setMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentsList;
