import { Button } from "@/components/ui/Button";
import H2 from "@/components/ui/H2";
import { Input } from "@/components/ui/Input";
import MessageBar from "@/components/ui/MessageBar";
import { baseUrl } from "@/lib/baseUrl";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import EditAdmin from "./EditAdmin";

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

interface Admin {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  adminId: string;
  email: string;
  phoneNumber: string;
  profile?: string;
  [key: string]: any;
}

const AdminList = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const auth = JSON.parse(localStorage.getItem("user") || "{}");


  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backend_url}/admin/admins`, {
        withCredentials: true,
      });
      // console.log('Fetched admins:', res.data.admins)
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error("Error fetching admin:", err);
    }
    setLoading(false);
  };

  const handleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleEdit = (admin: Admin) => {
    setEditAdmin(admin);
  };

  const handleCloseEdit = (updated?: boolean) => {
    setEditAdmin(null);
    if (updated) fetchAdmins(); // Refresh the list if updated
  };

  const handleDelete = async (
    adminId: string,
    firstName: string,
    lastName: string
  ) => {
    const curAdminId = auth.userId;
    if (
      !window.confirm(
        `Are you sure you want to remove admin: "${firstName} ${lastName}"?`
      )
    ) {
      return;
    }
    try {
      const res = await axios.delete(
        `${backend_url}/admin/admins/${curAdminId}/${adminId}`, { withCredentials: true,})
        .then((res) => {
          setMessage({ type: "success", text: res.data.message });
        })
        .catch((err) => {
          // console.log("Error deleting adminsss:", err);
          setMessage({ type: "error", text: err.response?.data?.message})
        })

      fetchAdmins();
    } catch (err) {
      console.error("Error deleting admin:", err);
      setMessage({
        type: "error",
        text: "Failed to delete admin. Please try again.",
      });
    }
  };

  const filteredAdmin = admins.filter((admin) => {
    return (
      admin.adminId
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      admin.firstName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase()) ||
      admin.lastName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    );
  });

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
          <MessageBar variant={message?.type} message={message?.text || ''} onClose={() => setMessage(null)}/>
          <H2 className="text-blue-700">Admin List</H2>
          <div className="mb-4">
          
            <Input
            type="search"
            placeholder="Search by adminId, or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-blue-100"
            />
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredAdmin.length === 0 ? (
            <span>Admin not found!</span>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* <input type="search" name="" id="" placeholder="search here..."/> */}
              <table className="w-full text-left">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">AdminId</th>
                    {/* <th className="px-4 py-3">Department</th> */}
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmin.map((admin) => (
                    <React.Fragment key={admin._id}>
                      <tr className="border-b border-gray-200 hover:bg-blue-50 transition">
                        <td className="px-4 py-3 font-medium">
                          {admin.firstName} {admin.middleName || ""}{" "}
                          {admin.lastName}
                          {
                            admin.adminId === auth.userId && (
                              <span className="bg-gradient-to-r from-green-200 to-green-300 p-1 rounded-2xl ml-2">(You)</span>
                            )
                          }
                        </td>
                        <td className="px-4 py-3">{admin.adminId}</td>
                        {/* <td className="px-4 py-3">{admin.department}</td> */}
                        <td className="px-4 py-3 flex gap-4">
                          <Button
                            variant={expanded === admin._id ? "outline" : "plain"}
                            onClick={() => handleExpand(admin._id)}
                          >
                            {expanded === admin._id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </Button>
                          <Button
                            className="bg-gradient-to-r from-green-500 to-green-700 hover:bg-green-600 focus:ring-green-500"
                            onClick={() => handleEdit(admin)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                          variant={"destructive"}
                          onClick={() => handleDelete(admin.adminId, admin.firstName, admin.lastName)}
                          >
                            <MdDeleteForever />
                          </Button>
                        </td>
                      </tr>
                      {/* AnimatePresence + motion for dropdown details */}
                      <AnimatePresence>
                        {expanded === admin._id && (
                          <motion.tr
                            className="bg-blue-50"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                          >
                            <td colSpan={4} className="px-6 py-4">
                              <div className="flex flex-col gap-2">
                                {admin.profile && (
                                  <div>
                                    <img
                                      src={`${base_url}/media/admin/${admin.profile}?v=${admin.updatedAt || Date.now()}`} 
                                      // Force the image to reload by appending a cache-busting query string (e.g., a timestamp or Date.now()) to the image URL.
    
                                      alt="Profile"
                                      className="w-16 h-16 rounded-full border-2 border-indigo-300 mt-2"
                                    />
                                  </div>
                                )}
                                <div>
                                  <span className="font-semibold">Email:</span>{" "}
                                  {admin.email}
                                </div>
                                <div>
                                  <span className="font-semibold">Phone:</span>{" "}
                                  {admin.phoneNumber}
                                </div>
                                
                                <div>
                                  <span className="font-semibold">Gender:</span>{" "}
                                  {admin.gender}
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
    
          {/* Edit admin modal  */}
          <AnimatePresence>
            {editAdmin && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EditAdmin
                  fetchAdmins={fetchAdmins}
                  admin={editAdmin}
                  onClose={handleCloseEdit}
                  setMessage={setMessage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  )
};

export default AdminList;
