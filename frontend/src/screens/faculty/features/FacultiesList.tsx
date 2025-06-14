import { Button } from '@/components/ui/Button';
import H2 from '@/components/ui/H2';
import { Input } from '@/components/ui/Input';
import MessageBar from '@/components/ui/MessageBar';
import { baseUrl } from '@/lib/baseUrl';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import EditFaculty from './EditFaculty';

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

interface Faculty {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  facultyId: string;
  department: string;
  email: string;
  phoneNumber: string;
  experience: string;
  post: string;
  profile?: string;
  [key: string]: any;
}

const FacultiesList = () => {
    const [faculties, setFaculties] = useState<Faculty[]>([]);
      const [expanded, setExpanded] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [editFaculty, setEditFaculty] = useState<Faculty | null>(null);
      const [message, setMessage] = useState<{type: "success" | "error"; text: string} | null >(null);
      const [searchTerm, setSearchTerm] = useState("");

      useEffect(() => {
          fetchFaculties();
        }, []);

        const fetchFaculties = async () => {
            setLoading(true);
            try {
              const res = await axios.get(`${backend_url}/admin/faculty`, {
                withCredentials: true,
              });
              // console.log('Fetched faculties:', res.data.faculties)
              setFaculties(res.data.faculties || []);
            } catch (err) {
              console.error("Error fetching faculty:", err);
            }
            setLoading(false);
          };

          const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleEdit = (faculty: Faculty) => {
    setEditFaculty(faculty);
  };

  const handleCloseEdit = (updated?: boolean) => {
    setEditFaculty(null);
    if (updated) fetchFaculties(); // Refresh the list if updated
  };

  const handleDelete = async (facultyId: string, firstName: string, lastName: string) => {
    if (!window.confirm(`Are you sure you want to remove faculty: "${firstName} ${lastName}"?`)) {
      return;
    }
    try {
      const res = await axios.delete(`${backend_url}/admin/faculty/${facultyId}`, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: res.data.message });
      fetchFaculties();
    } catch (err) {
      console.error("Error deleting faculty:", err);
      setMessage({ type: "error", text: "Failed to delete faculty. Please try again." });
    }
  }

  const filteredFaculty = faculties.filter((faculty) => {
    return faculty.facultyId.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            faculty.firstName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            faculty.lastName.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            faculty.department.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <MessageBar variant={message?.type} message={message?.text || ''} onClose={() => setMessage(null)}/>
      <H2 className="text-blue-700">Faculty List</H2>
      <div className="mb-4">
      
        <Input
        type="search"
        placeholder="Search by facultyId, Name or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-blue-100"
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredFaculty.length === 0 ? (
        <span>Faculty not found!</span>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* <input type="search" name="" id="" placeholder="search here..."/> */}
          <table className="w-full text-left">
            <thead className="bg-blue-200">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">FacultyId</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((faculty) => (
                <React.Fragment key={faculty._id}>
                  <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                    <td className="px-4 py-3 font-medium">
                      {faculty.firstName} {faculty.middleName || ""}{" "}
                      {faculty.lastName}
                    </td>
                    <td className="px-4 py-3">{faculty.facultyId}</td>
                    <td className="px-4 py-3">{faculty.department}</td>
                    <td className="px-4 py-3 flex gap-4">
                      <Button
                        variant={expanded === faculty._id ? "outline" : "plain"}
                        onClick={() => handleExpand(faculty._id)}
                      >
                        {expanded === faculty._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-600 focus:ring-green-500"
                        onClick={() => handleEdit(faculty)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                      variant={"destructive"}
                      onClick={() => handleDelete(faculty.facultyId, faculty.firstName, faculty.lastName)}
                      >
                        <MdDeleteForever />
                      </Button>
                    </td>
                  </tr>
                  {/* AnimatePresence + motion for dropdown details */}
                  <AnimatePresence>
                    {expanded === faculty._id && (
                      <motion.tr
                        className="bg-blue-50"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <td colSpan={4} className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            {faculty.profile && (
                              <div>
                                <img
                                  src={`${base_url}/media/faculty/${faculty.profile}?v=${faculty.updatedAt || Date.now()}`} 
                                  // Force the image to reload by appending a cache-busting query string (e.g., a timestamp or Date.now()) to the image URL.

                                  alt="Profile"
                                  className="w-16 h-16 rounded-full border-2 border-indigo-300 mt-2"
                                />
                              </div>
                            )}
                            <div>
                              <span className="font-semibold">Email:</span>{" "}
                              {faculty.email}
                            </div>
                            <div>
                              <span className="font-semibold">Phone:</span>{" "}
                              {faculty.phoneNumber}
                            </div>
                            {/* <div>
                              <span className="font-semibold">Semester:</span>{" "}
                              {faculty.semester}
                            </div> */}
                            <div>
                              <span className="font-semibold">Gender:</span>{" "}
                              {faculty.gender}
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

      {/* Edit faculty modal  */}
      <AnimatePresence>
        {editFaculty && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditFaculty
              fetchFaculties={fetchFaculties}
              faculty={editFaculty}
              onClose={handleCloseEdit}
              setMessage={setMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FacultiesList