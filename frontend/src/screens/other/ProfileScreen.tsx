import Sidebar from "@/components/ui/Sidebar";
import { Button } from "@/components/ui/Button";
import H2 from "@/components/ui/H2";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
// import { useSelector } from 'react-redux'
import { useNavigate } from "react-router";
import axios from "axios";
import { baseUrl } from "@/lib/baseUrl";
import { extractDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import EditProfile from "./features/EditProfile";
import MessageBar from "@/components/ui/MessageBar";
import ChangePassword from "./features/ChangePassword";

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

const ProfileScreen = () => {

  // const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  // console.log('User from localStorage:', auth);

  const [editProfile, setEditProfile] = useState<object>();
  const [changePassword, setChangePassword] = useState<object>();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);


  const [user, setUser] = useState({
    name: "",
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    userId: "",
    adminId: "",
    enrollmentNo: "",
    facultyId: "",
    role: auth?.role?.toLowerCase(),
    profile:"",
    department: "",
    joined: "",
  })

  const fetchCurrUser = async () => {
    try {
      const response = await axios.get(`${backend_url}/${user.role}/me`, {withCredentials: true});
      // console.log('Response user data:', response);
      console.log("Role from auth:", auth.role);
      
      setUser(prev => ({
        ...prev,
        name: `${response.data.user?.firstName} ${response.data.user?.middleName} ${response.data.user?.lastName}`,
        firstName: response.data.user?.firstName,
        middleName: response.data.user?.middleName,
        lastName: response.data.user?.lastName,
        gender: response.data.user?.gender,
        phoneNumber: response.data.user?.phoneNumber,
        email: response.data.user.email,
        userId: response.data.user.adminId || response.data.user.enrollmentNo || response.data.user.facultyId, // Use adminId if available, else userId
        adminId: response.data?.user?.adminId || "",
        enrollmentNo: response.data?.user?.enrollmentNo || "",
        facultyId: response.data?.user?.facultyId || "",
        role: auth?.role?.toLowerCase(),
        profile: response.data.user.profile || "",
        department: response.data.user.branch || response.data.user.department || "", // Use branch or department based on user type
        joined: extractDate(response.data.user.createdAt) || "01-01-2000", // Default date if not available
      }))
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    }
  }
  useEffect(() => {
    if(auth && auth.userId && auth.role){
      fetchCurrUser();
    }
  }, [])

  // Prevent rendering if not authenticated
  if (!auth || !auth.userId) return null;

  const handleEditProfile = () => {
    if(user.name.trim().length > 0){
      console.log('User data:', user);
      setEditProfile(user);
    }
  }

  const handleChangePassword = () => {
    if(user.name.trim().length > 0){
      // console.log('User data:', user);
      setChangePassword(user);
    }
  }

  const handleCloseEdit = (updated?: boolean) => {
    setEditProfile(undefined);
    if (updated) {
      // Optionally, you can refresh the user data here
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    }
  };

  const handleCloseChangePassword = (updated?: boolean) => {
    setChangePassword(undefined);
  }

  return (
    // <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-1 items-center justify-center">
        <MessageBar variant={message?.type} message={message?.text || ""} onClose={() => setMessage(null)}/>
      {/* <Sidebar role={user.role} /> */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          {/* <FaUserCircle className="text-blue-500 mb-4" size={80} /> */}
          <img
            src={`${base_url}/media/${user.role}/${user.profile}?v=${ Date.now()}` || `${base_url}/media/default/${user.profile}?v=${ Date.now()}`}
            alt={`${user.profile}`}
            className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-200"
          />
          <H2 className="text-blue-700">{user.name}</H2>
          <p className="text-gray-600 mb-1">{user.email}</p>
          <p className="text-gray-600 mb-1">{user.userId}</p>
          <span className="inline-block bg-indigo-100 text-blue-700 px-3 py-1 rounded-full text-sm mb-4">
            {user.role}
          </span>
          <div className="w-full border-t border-gray-200 my-4"></div>
          <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between">
              {
                user.department && (
                  <>
                    <span className="font-medium text-gray-700">Department:</span>
                    <span className="text-gray-600">{user.department}</span>
                  </>
                )
              }
              {/* <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-600">{user.department}</span> */}
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Joined:</span>
              <span className="text-gray-600">{user.joined}</span>
            </div>
          </div>

          <div className="w-full flex justify-between mt-6">
            <Button
            variant={"success"}
            onClick={handleEditProfile}
            >
              Edit Profile
            </Button>
            <Button
            variant={"outline"}
            onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </div>
        <AnimatePresence>
          { editProfile && (
            <motion.div
            className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            >
              <EditProfile
              fetchCurrUser={fetchCurrUser}
              user = {editProfile}
              onClose={handleCloseEdit}
              setMessage={setMessage}
              />
            </motion.div>
          )}
          {
            changePassword && (
              <motion.div
              className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
              >
                <ChangePassword user={changePassword} onClose={handleCloseChangePassword} setMessage={setMessage} />
              </motion.div>
            )
          }
        </AnimatePresence>
      </div>
    // </div>
  );
};

export default ProfileScreen;
