import express from "express";
import { facultyLoginController, facultyLogoutController, facultyRegisterController, getFacultyMyDetailsController, updateFacultyDetailsController, updateFacultyLoggedInPasswordController } from "../../controllers/facultyController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import { addStudentDetailsController, getAllStudentDetailsController, getStudentByIdDetailsController } from "../../controllers/studentController.js";
import upload from "../../middlewares/multerMiddleware.js";

const router = express.Router();

//auth
router.post('/auth/register', authenticate, roleOnly("Admin", "Faculty"), facultyRegisterController);
router.post('/auth/login', facultyLoginController);
router.post('/auth/logout', facultyLogoutController);

// Faculty - self actions
router.get("/me", authenticate, roleOnly("Faculty"), getFacultyMyDetailsController);
router.put("/me/password", authenticate, roleOnly("Faculty"), updateFacultyLoggedInPasswordController);
router.put("/:facultyId", authenticate, roleOnly("Faculty"), upload.single("profile"), updateFacultyDetailsController);  // Update faculty

// Student management (by faculty)
router.post( "/students", authenticate, roleOnly("Faculty"), upload.single("profile"), addStudentDetailsController);
// router.put("/update-student-password/:userId", authenticate, roleOnly("Faculty"), updateSelectedStudentPasswordController);
router.get("/students", authenticate, roleOnly("Faculty"), getAllStudentDetailsController);
router.get("/students/:enrollmentNo", authenticate, roleOnly("Faculty"), getStudentByIdDetailsController);

export default router;