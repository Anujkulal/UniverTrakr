import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { Button } from "@/components/ui/Button";

interface Student {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  enrollmentNo: string;
  branch: string;
}

interface StudentMark {
  _id: string;
  enrollmentNo: string;
  internal: {
    internal1: number;
    internal2: number;
  };
  internalAvg: number;
  assignment: number;
  totalInternal: number;
  external: number;
  finalMarks: number;
}

const backend_url = baseUrl();

const ListMarks = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsMarks, setStudentsMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(false);

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  const role = auth?.role?.toLowerCase() || "";
  const branchCode = auth?.branchCode || "";

  useEffect(() => {
    fetchStudentsAndMarks();
    // eslint-disable-next-line
  }, []);

  // Fetch students and their marks
  const fetchStudentsAndMarks = async () => {
    setLoading(true);
    try {
      // Fetch students for the faculty's branch
      const studentResponse = await axios.get(
        `${backend_url}/faculty/students/${branchCode}`,
        { withCredentials: true }
      );
      setStudents(studentResponse.data.students || []);

      // Fetch all marks for the branch
      const marksResponse = await axios.get(
        `${backend_url}/faculty/marks/${branchCode}`,
        { withCredentials: true }
      );
      setStudentsMarks(marksResponse.data.marks || []);
    } catch (err) {
      console.error("Error fetching students or marks:", err);
    }
    setLoading(false);
  };

  // Helper to get marks for a student
  const getStudentMark = (enrollmentNo: string) =>
    studentsMarks.find((m) => m.enrollmentNo === enrollmentNo);

  // Helper to get full name
  const getFullName = (student: Student) =>
    [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(" ");

  // Add/Edit handler
  const handleAddEdit = (student: Student) => {
    // Example: navigate(`/faculty/marks/${student.enrollmentNo}`)
    alert(`Add/Edit marks for ${getFullName(student)} (${student.enrollmentNo})`);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-blue-800 mb-6">
        Student Marks List
      </h2>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Enrollment No</th>
                <th className="px-4 py-2">Branch</th>
                <th className="px-4 py-2">Total Marks</th>
                <th className="px-4 py-2">State</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => {
                  const mark = getStudentMark(student.enrollmentNo);
                  const marksAdded = !!mark;
                  return (
                    <tr key={student._id} className="border-b">
                      <td className="px-4 py-2">{getFullName(student)}</td>
                      <td className="px-4 py-2">{student.enrollmentNo}</td>
                      <td className="px-4 py-2">{student.branch}</td>
                      <td className="px-4 py-2">
                        {marksAdded
                          ? mark?.finalMarks ?? "-"
                          : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {marksAdded ? (
                          <span className="text-green-600 font-semibold">Added</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Not Added</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant={marksAdded ? "outline" : "default"}
                          onClick={() => handleAddEdit(student)}
                        >
                          {marksAdded ? "Edit" : "Add"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListMarks;