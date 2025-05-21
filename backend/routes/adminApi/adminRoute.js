import express from "express";
import {
  addAdminDetailsController,
  adminLoginController,
  adminLogoutController,
  adminRegisterController,
  getAdminByIdDetailsController,
  getAllAdminDetailsController,
  getMyDetailsController,
  updateAdminDetailsController,
  updateAdminLoggedInPasswordController,
  updateSelectedAdminPasswordController,
} from "../../controllers/adminController.js";
import {
  addStudentDetailsController,
  getAllStudentDetailsController,
  getStudentByIdDetailsController,
  updateSelectedStudentPasswordController,
  updateStudentDetailsController
} from "../../controllers/studentController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import upload from "../../middlewares/multerMiddleware.js";

const router = express.Router();

// Auth
router.post("/auth/register", authenticate, roleOnly("Admin"), adminRegisterController);
router.post("/auth/login", adminLoginController);
router.post("/auth/logout", adminLogoutController);

// Admin - self actions
router.get("/me", authenticate, roleOnly("Admin"), getMyDetailsController);
router.put("/me/password", authenticate, roleOnly("Admin"), updateAdminLoggedInPasswordController);

// Admin - admin management
router.post("/", authenticate, upload.single("profile"), roleOnly("Admin"), addAdminDetailsController);  // Create admin
router.get("/", authenticate, roleOnly("Admin"), getAllAdminDetailsController);                         // Get all admins
router.get("/:adminId", authenticate, roleOnly("Admin"), getAdminByIdDetailsController);                // Get admin by ID
router.put("/:adminId", authenticate, roleOnly("Admin"), upload.single("profile"), updateAdminDetailsController);  // Update admin
router.put("/:userId/password", authenticate, roleOnly("Admin"), updateSelectedAdminPasswordController); // Update another admin's password

// Student management (by Admin)
router.post("/students", authenticate, roleOnly("Admin"), upload.single("profile"), addStudentDetailsController);      // Add student
router.get("/students", authenticate, roleOnly("Admin"), getAllStudentDetailsController);                              // Get all students
router.get("/students/:enrollmentNo", authenticate, roleOnly("Admin"), getStudentByIdDetailsController);               // Get student by enrollmentNo
router.put("/students/:userId/password", authenticate, roleOnly("Admin"), updateSelectedStudentPasswordController);    // Update student password
router.put("/students/:enrollmentNo", authenticate, roleOnly("Admin"), upload.single("profile"), updateStudentDetailsController);    // Update student details

export default router;
