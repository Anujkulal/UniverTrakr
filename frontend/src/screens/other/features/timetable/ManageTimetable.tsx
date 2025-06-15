import { Button } from '@/components/ui/Button';
import H2 from '@/components/ui/H2';
import { Input } from '@/components/ui/Input';
import MessageBar from '@/components/ui/MessageBar';
import { baseUrl } from '@/lib/baseUrl';
import { fetchTimetable } from '@/redux/slices/timetableSlice';
import type { AppDispatch, RootState } from '@/redux/store';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaEdit } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import EditTimetable from './EditTimetable';

const backend_url = baseUrl();

interface Timetable {
  _id: string;
  branch: string;
  semester: string;
  timings: string[];
  data: string[][];
}

const ManageTimetable = () => {
    const [timetables, setTimetables] = useState<Timetable[]>([]);
    //   const [expanded, setExpanded] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const [editTimetable, setEditTimetable] = useState<Timetable | null>(null);
      const [message, setMessage] = useState<{type: "success" | "error"; text: string} | null >(null);
    //   const [searchTerm, setSearchTerm] = useState("");

    // const {error, success } = useSelector((state: RootState) => state.timetable);
      const dispatch = useDispatch<AppDispatch>();
      const auth = JSON.parse(localStorage.getItem("user") || "{}");
      const role = auth?.role?.toLowerCase() || "";
      const branchCode = auth?.branchCode || "";

    const handleFetchTimetable = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${backend_url}/${auth.role.toLowerCase()}/timetable`, { withCredentials: true });
            console.log("Fetched timetables:", response.data);
            setTimetables(response.data || []);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setMessage({ type: "error", text: error.response?.data?.message || "Failed to fetch timetables" });
        }
    };

  useEffect(() => {
    handleFetchTimetable();
  }, [])

  const handleEdit = (timetable: Timetable) => {
    setEditTimetable(timetable);
  };

  const handleDelete = async (branch: string, semester: string) => {
    if (!window.confirm(`Are you sure you want to remove timetable of "${branch} branch ${semester}" sem?`)) {
      return;
    }
    try {
      const res = await axios.delete(`${backend_url}/${auth.role.toLowerCase()}/timetable/${branch}/${semester}`, {
        withCredentials: true,
      });
      setMessage({ type: "success", text: res.data.message });
      handleFetchTimetable();
    } catch (err) {
      console.error("Error deleting timetable:", err);
      setMessage({ type: "error", text: "Failed to delete timetable. Please try again." });
    }
  }

  const handleCloseEdit = (updated?: boolean) => {
    setEditTimetable(null);
    if (updated) handleFetchTimetable(); // Refresh the list if updated
  };
  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      <MessageBar variant={message?.type} message={message?.text || ''} onClose={() => setMessage(null)}/>
      <H2 className="text-blue-700">Timetable List</H2>
      <div className="mb-4">
      </div>
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : timetables.length === 0 ? (
        <span>Timetable not found!</span>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* <input type="search" name="" id="" placeholder="search here..."/> */}
          <table className="w-full text-left">
            <thead className="bg-blue-200">
              <tr>
                
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
              role === "faculty" ? (
                timetables.map(timetable => (
                  branchCode === timetable.branch && (
                  <React.Fragment key={timetable._id}>
                    <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                      
                      <td className="px-4 py-3">{timetable.branch}</td>
                      <td className="px-4 py-3">{timetable.semester}</td>
                      <td className="px-4 py-3 flex gap-4">
                        
                        <Button
                          className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-600 focus:ring-green-500"
                          onClick={() => handleEdit(timetable)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                        variant={"destructive"}
                        onClick={() => handleDelete(timetable.branch, timetable.semester)}
                        >
                          <MdDeleteForever />
                        </Button>
                      </td>
                    </tr>
                  </React.Fragment>
                  )
                ))
              ) : (
                
                timetables.map((timetable) => (
                  <React.Fragment key={timetable._id}>
                    <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                      
                      <td className="px-4 py-3">{timetable.branch}</td>
                      <td className="px-4 py-3">{timetable.semester}</td>
                      <td className="px-4 py-3 flex gap-4">
                        
                        <Button
                          className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-600 focus:ring-green-500"
                          onClick={() => handleEdit(timetable)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                        variant={"destructive"}
                        onClick={() => handleDelete(timetable.branch, timetable.semester)}
                        >
                          <MdDeleteForever />
                        </Button>
                      </td>
                    </tr>
                    
                  </React.Fragment>
                ))
              )
              }
            </tbody>
          </table>
        </div>
      )}

      {/* Edit student modal  */}
      <AnimatePresence>
        {editTimetable && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EditTimetable
              fetchTimetable={handleFetchTimetable}
              timetable={editTimetable}
              onClose={handleCloseEdit}
              setMessage={setMessage}
              role={auth.role.toLowerCase()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageTimetable