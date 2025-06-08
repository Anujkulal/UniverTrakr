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

const backend_url = baseUrl();
const base_url = backend_url.replace("/api", "");

const ProfileScreen = () => {
  // const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem("user") || "{}");
  // console.log('User from localStorage:', auth)

  const [user, setUser] = useState({
    name: "",
    email: "",
    userId: "",
    role: auth?.role?.toLowerCase(),
    profile:"",
    department: "",
    joined: "",
  })

  // // Redirect if not authenticated
  // useEffect(() => {
  //   // console.log("Checking window location:", window.location)
  //   if (!auth || !auth.userId) {
  //     if (window.location.pathname !== "/signin") {
  //       console.error("No user data found, redirecting to sign-in page.");
  //       navigate("/signin", { replace: true });
  //     }
  //   }
  // }, [auth, navigate]);

  useEffect(() => {
    const getCurrUser = async () => {
      try {
        const response = await axios.get(`${backend_url}/${auth.role}/me`, {withCredentials: true});
        console.log('Current user data:', response);
        // console.log("Role from auth:", auth.role);
        
        setUser(prev => ({
          ...prev,
          name: `${response.data.user?.firstName} ${response.data.user?.middleName} ${response.data.user?.lastName}`,
          email: response.data.user.email,
          userId: response.data.user.adminId || response.data.user.enrollmentNo || response.data.user.enrollmentNo, // Use adminId if available, else userId
          role: auth?.role?.toLowerCase(),
          profile: response.data.user.profile || "",
          department: response.data.user.branch || "Nil",
          joined: extractDate(response.data.user.createdAt) || "01-01-2000", // Default date if not available
        }))
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
      }
    }
    if(auth && auth.userId && auth.role){
      getCurrUser();
    }
  }, [])

  // const getCurrUser = async () => {
  //   const response = await axios.get(`${backend_url}/${auth.role}/me`);
  //   // console.log('Current user data:', response);
  //   user.name = `${response.data.user.firstname} ${response.data.user.middlename} ${response.data.user.lastname}`;
  // };
  // getCurrUser();
  
  // Dummy user data for UI demonstration
  // const user = {
  //   name: "",
  //   email: auth?.userId,
  //   role: auth?.role?.toLowerCase(),
  //   department: "Computer Science",
  //   joined: "2023-08-15",
  // };

  // Prevent rendering if not authenticated
  if (!auth || !auth.userId) return null;

  return (
    // <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-1 items-center justify-center">
      {/* <Sidebar role={user.role} /> */}
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
          {/* <FaUserCircle className="text-blue-500 mb-4" size={80} /> */}
          <img
            src={`${base_url}/media/${user.role}/${user.profile}` || `${base_url}/media/default/${user.profile}`}
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
              <span className="font-medium text-gray-700">Department:</span>
              <span className="text-gray-600">{user.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Joined:</span>
              <span className="text-gray-600">{user.joined}</span>
            </div>
          </div>

          <Button>Edit Profile</Button>
        </div>
      </div>
    // </div>
  );
};

export default ProfileScreen;
