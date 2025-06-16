import { Button } from "@/components/ui/Button";
import React, { useEffect, useState } from "react";
import UploadMarks from "./features/marks/UploadMarks";
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import MessageBar from "@/components/ui/MessageBar";
import H2 from "@/components/ui/H2";
import { Input } from "@/components/ui/Input";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

interface Student {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  enrollmentNo: string;
  branch: string;
  email: string;
  phoneNumber: string;
  semester: string;
  gender: string;
  profile?: string;
  [key: string]: any;
}

interface SubjectProps {
  name: string;
  code: string;
}

const MarksScreen = () => {
  // const [mode, setMode] = useState<'view' | 'upload-marks' | 'list' | 'manage'>('view')

  const [students, setStudents] = useState<Student[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<SubjectProps[]>([]);
  const [inputSubject, setInputSubject] = useState<string>("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [marksDetails, setMarksDetails] = useState([]);

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  // Fetch students for the faculty's branch
  const fetchStudents = async () => {
    setLoading(true);
    try {
      // if(role === "faculty"){
      const res = await axios.get(
        `${backend_url}/faculty/students/${branchCode}`,
        {
          withCredentials: true,
        }
      );
      // console.log('Fetched students:', res.data.students)
      setStudents(res.data.students || []);
      setLoading(false);
      return;
      // }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
    setLoading(false);
  };

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleOpenUpload = (enrollmentNo: string) => {
    setIsUploading(enrollmentNo);
  };

  const handleCloseUpload = (updated?: boolean) => {
    setIsUploading(null);
    if (updated) fetchStudents(); // Refresh the list if updated
  };

  // Filter students by search term
  const filteredStudents = students.filter((student) => {
    return (
      student.enrollmentNo
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      student.firstName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      student.lastName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      student.branch.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  });

  // Fetch subjects for the faculty's branch
  const fetchSubjects = async () => {
    if(role !== "student"){
      try {
        const response = await axios.get(
          `${backend_url}/${auth.role.toLowerCase()}/subject`,
          { withCredentials: true }
        );
        setSubjects(response.data.subject || []);
        // console.log("Fetched subjects:", response.data.subject);
      } catch (err) {
        console.error("Failed to fetch subjects:", err);
      }
    }
  };

  useEffect(() => {
    if (auth && auth.role) fetchSubjects();
  }, []);

  
  // fetch marks for student
  const fetchMarks = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await axios.get(`${backend_url}/student/marks/${auth.userId}`, { withCredentials: true})
      console.log("Fethced marks::: ", response.data.marks)
      setMarksDetails(response.data.marks || [])
    } catch (err) {
      console.error('Failed to fetch subject:', err)
    }
  }
  useEffect(() => {
    if(role === "admin" || role === "faculty") fetchStudents();
    else fetchMarks()
  }, []);

  console.log("marksdetails:::", marksDetails)

  return (
    <>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <MessageBar
          variant={message?.type}
          message={message?.text || ""}
          onClose={() => setMessage(null)}
        />
        {
          role === "student" ? (
            <div className="rounded-2xl p-4 bg-white shadow-lg overflow-hidden">
              <table className="w-full text-left rounded-xl">
                <thead className="rounded-2xl border-b border-gray-300">
                  <tr>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">IA 1</th>
                    <th className="px-4 py-3">IA 2</th>
                    <th className="px-4 py-3">IA Average</th>
                    <th className="px-4 py-3">Assignment</th>
                    <th className="px-4 py-3">Internal Marks</th>
                    <th className="px-4 py-3">External Marks</th>
                    <th className="px-4 py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    marksDetails.map((marks) => (
                      <tr key={marks.subject}>
                          <td className="px-4 py-3">{marks.subject}</td>
                          <td className="px-4 py-3">{marks.internal.internal1}</td>
                          <td className="px-4 py-3">{marks.internal.internal2}</td>
                          <td className="px-4 py-3">{marks.internalAvg}</td>
                          <td className="px-4 py-3">{marks.assignment}</td>
                          <td className="px-4 py-3">{marks.totalInternal}</td>
                          <td className="px-4 py-3">{marks.external}</td>
                          <td className="px-4 py-3">{marks.totalMarks}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <H2 className="text-blue-700">Students List</H2>
              <div className="mb-4">
                <Input
                  type="search"
                  placeholder="Search by Enrollment No or Name..."
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
                                variant={
                                  expanded === student._id ? "outline" : "default"
                                }
                                onClick={() => handleExpand(student._id)}
                              >
                                {expanded === student._id
                                  ? /* <FaChevronUp /> */ "Back"
                                  : /* <FaChevronDown /> */ "Next"}
                              </Button>
                              {/* <Button
                                      className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-600 focus:ring-green-500"
                                      // onClick={() => handleEdit(student)}
                                    >
                                      <FaEdit />
                                    </Button> */}
                              {role === "admin" && (
                                <Button
                                  variant={"destructive"}
                                  // onClick={() => handleDelete(student.enrollmentNo, student.firstName, student.lastName)}
                                >
                                  <MdDeleteForever />
                                </Button>
                              )}
                            </td>
                          </tr>

                          {/* AnimatePresence + motion for dropdown details */}
                          <AnimatePresence>
                            {expanded === student._id && (
                              <motion.tr
                                className="bg-blue-50 p-2"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                              >
                                {/* <Input 
                                      value={student.branch}
                                      disabled
                                      className='cursor-not-allowed bg-gray-100'
                                      placeholder="Branch"
                                      /> */}
                                <td colSpan={4} className="px-6 py-4">
                                  <div className="flex gap-2 justify-between">
                                    <span className="border border-gray-300 p-2 rounded-2xl bg-gradient-to-r from-green-100 to-green-200">Branch: {student.branch}</span>
                                    <span className="border border-gray-300 p-2 rounded-2xl bg-gradient-to-r from-green-100 to-green-200">Semester: {student.semester}</span>
                                    <select
                                      name="subject"
                                      id="subject"
                                      value={inputSubject}
                                      onChange={(e) => setInputSubject(e.target.value)}
                                      className="px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-400"
                                    >
                                      <option value="">Select Subject</option>
                                      {subjects.map((subject) => (
                                        <option key={subject.code} value={subject.code}>
                                          {subject.name} ({subject.code})
                                        </option>
                                      ))}
                                    </select>
                                    <Button
                                    className="bg-gradient-to-r from-orange-500 to-orange-700 hover:bg-blue-600 focus:ring-blue-500"
                                    onClick={() => handleOpenUpload(student.enrollmentNo)}
                                    disabled={!inputSubject}
                                    >
                                      upload marks
                                    </Button>
                                  </div>
                                </td>
                                {/* <td colSpan={4} className="px-6 py-4">
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
                                      </td> */}
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
                {isUploading && (
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <UploadMarks
                      fetchStudents={fetchStudents}
                      // subjects={subjects}
                      enrollmentNo={isUploading}
                      subject={inputSubject}
                      // setInputSubject={setInputSubject}
                      onClose={handleCloseUpload}
                      setMessage={setMessage}
                    />
                    {/* <EditStudent
                            fetchStudents={fetchStudents}
                            student={editStudent}
                            // onClose={handleCloseEdit}
                            setMessage={setMessage}
                          /> */}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )
        }
      </div>
    </>
  );
};

export default MarksScreen;
