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
  addMultipleStudentsController,
  addStudentDetailsController,
  deleteStudentController,
  getAllStudentDetailsController,
  getStudentByIdDetailsController,
  updateSelectedStudentPasswordController,
  updateStudentDetailsController
} from "../../controllers/studentController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import upload from "../../middlewares/multerMiddleware.js";
import { addBranchController, getAllBranchController, removeBranchController } from "../../controllers/other/branchController.js";
import { addFacultyDetailsController, addMultipleFacultyController, deleteFacultyController, getAllFacultyDetailsController, getFacultyByIdDetailsController, updateFacultyDetailsController, updateSelectedFacultyPasswordController } from "../../controllers/facultyController.js";
import { deleteTimetableController, getTimetableController, saveTimetableController, updateTimetableController } from "../../controllers/other/timetableController.js";

const router = express.Router();

// Auth
router.post("/auth/register", authenticate, roleOnly("Admin"), adminRegisterController);
router.post("/auth/login", adminLoginController);
router.post("/auth/logout", adminLogoutController);

// Admin - self actions
router.get("/me", authenticate, roleOnly("Admin"), getMyDetailsController);
router.put("/me/password", authenticate, roleOnly("Admin"), updateAdminLoggedInPasswordController);

// Student management (by Admin)
router.post("/students", authenticate, roleOnly("Admin"), upload.single("profile"), addStudentDetailsController);      // Add student
router.post("/students/bulk", authenticate, roleOnly("Admin"), addMultipleStudentsController);
router.get("/students", authenticate, roleOnly("Admin"), getAllStudentDetailsController);                              // Get all students
router.get("/students/:enrollmentNo", authenticate, roleOnly("Admin"), getStudentByIdDetailsController);               // Get student by enrollmentNo
router.put("/students/:userId/password", authenticate, roleOnly("Admin"), updateSelectedStudentPasswordController);    // Update student password
router.put("/students/:enrollmentNo", authenticate, roleOnly("Admin"), upload.single("profile"), updateStudentDetailsController);    // Update student details
router.delete("/students/:enrollmentNo", authenticate, roleOnly("Admin"), deleteStudentController)

//Faculty management (by Admin)
router.post("/faculty", authenticate, roleOnly("Admin"), upload.single("profile"), addFacultyDetailsController);      // Add faculty
router.post("/faculty/bulk", authenticate, roleOnly("Admin"), addMultipleFacultyController); // Add multiple faculty
router.get("/faculty", authenticate, roleOnly("Admin"), getAllFacultyDetailsController);                              // Get all faculty
router.get("/faculty/:facultyId", authenticate, roleOnly("Admin"), getFacultyByIdDetailsController);               // Get faculty by enrollmentNo
router.put("/faculty/:userId/password", authenticate, roleOnly("Admin"), updateSelectedFacultyPasswordController);    // Update faculty password
router.put("/faculty/:facultyId", authenticate, roleOnly("Admin"), upload.single("profile"), updateFacultyDetailsController);    // Update faculty details
router.delete("/faculty/:facultyId", authenticate, roleOnly("Admin"), deleteFacultyController) // Delete faculty

// Timetable management (by Admin)
router.post("/timetable", authenticate, roleOnly("Admin"), saveTimetableController); // Add timetable
router.get("/timetable", authenticate, roleOnly("Admin"), getTimetableController); // Get all timetables
router.delete("/timetable/:branch/:semester", authenticate, roleOnly("Admin"), deleteTimetableController); // Get timetable by branch and semester
router.put("/timetable/:branch/:semester", authenticate, roleOnly("Admin"), updateTimetableController);

// Branch management (by Admin)
router.post("/branch", authenticate, roleOnly("Admin"), addBranchController)
router.get("/branch", authenticate, roleOnly("Admin"), getAllBranchController)
router.delete("/branch/:branchCode", authenticate, roleOnly("Admin"), removeBranchController);

// Admin - admin management
router.post("/", authenticate, upload.single("profile"), roleOnly("Admin"), addAdminDetailsController);  // Create admin
router.get("/", authenticate, roleOnly("Admin"), getAllAdminDetailsController);                         // Get all admins
router.get("/:adminId", authenticate, roleOnly("Admin"), getAdminByIdDetailsController);                // Get admin by ID
router.put("/:adminId", authenticate, roleOnly("Admin"), upload.single("profile"), updateAdminDetailsController);  // Update admin
router.put("/:userId/password", authenticate, roleOnly("Admin"), updateSelectedAdminPasswordController); // Update another admin's password

export default router;
