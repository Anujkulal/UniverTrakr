import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/redux/store";
import H2 from "@/components/ui/H2";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { login } from "@/redux/slices/authSlice";
import MessageBar from "@/components/ui/MessageBar";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { MdArrowBackIos } from "react-icons/md";

const roles = [{ value: "admin" }, { value: "faculty" }, { value: "student" }];

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  // console.log('Auth state:', auth)

  // Use role from location.state if present, else default to 'admin'
  const [role, setRole] = useState(() => {
    const stateRole = location.state?.role;
    // console.log('Initial role from state:', stateRole)
    return roles.some((r) => r.value === stateRole) ? stateRole : "admin";
  });
  // console.log('Current role:', role)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (
      location.state?.role &&
      roles.some((r) => r.value === location.state.role)
    ) {
      setRole(location.state.role);
    }
  }, [location.state]);

  useEffect(() => {
    if (auth.error) setError(auth.error);
    else setError("");
    if (auth.user) {
      // console.log("User logged in role:", role);
      // Redirect to dashboard or home after successful login
      if(role === "admin") {
        navigate("/admin/dashboard");
      }
      else{
        navigate(`/${role}/profile`);
      }
    }
  }, [auth, navigate]);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    dispatch(login({ email, password, role }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
        variant={"plain"}
        onClick={() => navigate("/")}>
          <MdArrowBackIos size={20} className="mr-2" />
          {/* Back */}
        </Button>
        <H2 className="text-blue-700">Sign In</H2>
        <div className="flex justify-center mb-6 space-x-4">
          {roles.map((r) => (
            <Button
              type="button"
              key={r.value}
              onClick={() => handleRoleChange(r.value)}
              variant={role === r.value ? "default" : "outline"}
            >
              {r.value.charAt(0).toUpperCase() + r.value.slice(1)}{" "}
              {/* Capitalize first letter of role */}
            </Button>
          ))}
        </div>
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="mb-4">
            <Input
              id="email"
              name="email"
              type="text"
              label="User ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="pr-10" // add space for the icon
            />

            <span
              className="absolute right-3 top-8/12 transform -translate-y-1/2 cursor-pointer text-gray-600 "
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          {error && <MessageBar variant="error" message={error} onClose={() => setError("")} />}
          <Button type="submit" className="w-full mt-2" disabled={auth.loading}>
            {auth.loading
              ? "Signing In..."
              : `Sign In as ${roles.find((r) => r.value === role)?.value}`}
          </Button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Signin;
