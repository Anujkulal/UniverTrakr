import express from "express";
import {
  getStudentMyDetailsController,
  studentLoginController,
  studentLogoutController,
  studentRegisterController,
  updateStudentLoggedInPasswordController
} from "../../controllers/studentController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import { GetAllNoticesController } from "../../controllers/other/NoticeController.js";
import { viewTimetableController } from "../../controllers/other/timetableController.js";

const router = express.Router();

// Auth
router.post("/auth/register", authenticate, roleOnly("Admin", "Faculty"), studentRegisterController);
router.post("/auth/login", studentLoginController);
router.post("/auth/logout", studentLogoutController);

// Notice
router.get("/notice", authenticate, roleOnly("Student"), GetAllNoticesController); // Get all notices

// timetable
router.get("/timetable/:branch/:semester", authenticate, roleOnly("Student"), viewTimetableController);


// Student self
router.put("/me/password", authenticate, roleOnly("Student"), updateStudentLoggedInPasswordController);
router.get("/me", authenticate, roleOnly("Student"), getStudentMyDetailsController);

export default router;
