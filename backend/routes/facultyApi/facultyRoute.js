import express from "express";
import { facultyLoginController, facultyLogoutController, facultyRegisterController } from "../../controllers/facultyController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import { addStudentDetailsController, getAllStudentDetailsController, getStudentByIdDetailsController, updateSelectedStudentPasswordController } from "../../controllers/studentController.js";
import upload from "../../middlewares/multerMiddleware.js";

const router = express.Router();

//Faculty
router.post('/register', authenticate, roleOnly("Admin", "Faculty"), facultyRegisterController);
router.post('/login', facultyLoginController);
router.post('/logout', facultyLogoutController);

//student
router.post( "/add-student", authenticate, roleOnly("Faculty"), upload.single("profile"), addStudentDetailsController);
router.put("/update-student-password/:userId", authenticate, roleOnly("Faculty"), updateSelectedStudentPasswordController);
router.get("/get-allStudents", authenticate, roleOnly("Faculty"), getAllStudentDetailsController);
router.get("/get-studentById/:enrollmentNo", authenticate, roleOnly("Faculty"), getStudentByIdDetailsController);

export default router;