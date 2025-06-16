import express from "express";
import {
  getStudentMyDetailsController,
  studentLoginController,
  studentLogoutController,
  studentRegisterController,
  updateStudentDetailsController,
  updateStudentLoggedInPasswordController
} from "../../controllers/studentController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import { GetAllNoticesController } from "../../controllers/other/NoticeController.js";
import { viewTimetableController } from "../../controllers/other/timetableController.js";
import { viewMarksController } from "../../controllers/other/marksController.js";
import { getAllSubjectController } from "../../controllers/other/subjectController.js";
import { getMaterialController } from "../../controllers/other/materialController.js";
import upload from "../../middlewares/multerMiddleware.js";

const router = express.Router();

// Auth
router.post("/auth/register", authenticate, roleOnly("Admin", "Faculty"), studentRegisterController);
router.post("/auth/login", studentLoginController);
router.post("/auth/logout", studentLogoutController);

// subject
router.get("/subject", authenticate, roleOnly("Student"), getAllSubjectController);

// material
router.get("/material/:branchCode", authenticate, roleOnly("Student"), getMaterialController);

// Notice
router.get("/notice", authenticate, roleOnly("Student"), GetAllNoticesController); // Get all notices

// timetable
router.get("/timetable/:branch/:semester", authenticate, roleOnly("Student"), viewTimetableController);

//marks
router.get("/marks/:enrollmentNo", authenticate, roleOnly("Student"), viewMarksController);

// Student self
router.put("/me/password", authenticate, roleOnly("Student"), updateStudentLoggedInPasswordController);
router.get("/me", authenticate, roleOnly("Student"), getStudentMyDetailsController);
router.put("/students/:enrollmentNo", authenticate, roleOnly("Student"), upload.single("profile"), updateStudentDetailsController); 

export default router;
