import express from "express";
import { facultyLoginController, facultyLogoutController, facultyRegisterController, getFacultyMyDetailsController, updateFacultyDetailsController, updateFacultyLoggedInPasswordController } from "../../controllers/facultyController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import { addMultipleStudentsController, addStudentDetailsController, deleteStudentController, getAllStudentDetailsByBranchController, getStudentByIdDetailsController, updateStudentDetailsController } from "../../controllers/studentController.js";
import upload from "../../middlewares/multerMiddleware.js";
import { AddNoticeController, GetAllNoticesController, RemoveNoticeController } from "../../controllers/other/NoticeController.js";
import { deleteTimetableController, getTimetableController, saveTimetableController, updateTimetableController } from "../../controllers/other/timetableController.js";
import { addBranchController, getAllBranchController, removeBranchController } from "../../controllers/other/branchController.js";
import { addSubjectController, getAllSubjectController, removeSubjectController } from "../../controllers/other/subjectController.js";
import { getMarksByEnrollmentNoController } from "../../controllers/other/marksController.js";

const router = express.Router();

//auth
router.post('/auth/register', authenticate, roleOnly("Admin", "Faculty"), facultyRegisterController);
router.post('/auth/login', facultyLoginController);
router.post('/auth/logout', facultyLogoutController);

// Faculty - self actions
router.get("/me", authenticate, roleOnly("Faculty"), getFacultyMyDetailsController);
router.put("/me/password", authenticate, roleOnly("Faculty"), updateFacultyLoggedInPasswordController);
router.put("/facultys/:facultyId", authenticate, roleOnly("Faculty"), upload.single("profile"), updateFacultyDetailsController);  // Update faculty

// Student management (by faculty)
router.post("/students", authenticate, roleOnly("Faculty"), upload.single("profile"), addStudentDetailsController);
router.post("/students/bulk", authenticate, roleOnly("Faculty"), addMultipleStudentsController);
router.get("/students/:branchCode", authenticate, roleOnly("Faculty"), getAllStudentDetailsByBranchController);
router.get("/students/:enrollmentNo", authenticate, roleOnly("Faculty"), getStudentByIdDetailsController);
router.put("/students/:enrollmentNo", authenticate, roleOnly("Faculty"), upload.single("profile"), updateStudentDetailsController);    // Update student details
router.delete("/students/:enrollmentNo", authenticate, roleOnly("Faculty"), deleteStudentController)

// Marks management (by Faculty)
router.get("/marks/:enrollmentNo", authenticate, roleOnly("Faculty"), getMarksByEnrollmentNoController)

// Notice management (by Faculty)
router.post("/notice", authenticate, roleOnly("Faculty"), AddNoticeController); // Add notice
router.get("/notice", authenticate, roleOnly("Faculty"), GetAllNoticesController); // Get all notices
router.delete("/notice/:noticeId", authenticate, roleOnly("Faculty"), RemoveNoticeController); // remove notice

// Timetable management (by Faculty)
router.post("/timetable", authenticate, roleOnly("Faculty"), saveTimetableController); // Add timetable
router.get("/timetable", authenticate, roleOnly("Faculty"), getTimetableController); // Get all timetables
router.delete("/timetable/:branch/:semester", authenticate, roleOnly("Faculty"), deleteTimetableController); // Get timetable by branch and semester
router.put("/timetable/:branch/:semester", authenticate, roleOnly("Faculty"), updateTimetableController);

// Branch management (by Faculty)
router.post("/branch", authenticate, roleOnly("Faculty"), addBranchController)
router.get("/branch", authenticate, roleOnly("Faculty"), getAllBranchController)
router.delete("/branch/:branchCode", authenticate, roleOnly("Faculty"), removeBranchController);

// Subject management (by Faculty)
router.post("/subject", authenticate, roleOnly("Faculty"), addSubjectController)
router.get("/subject", authenticate, roleOnly("Faculty"), getAllSubjectController)
router.delete("/subject/:subjectCode", authenticate, roleOnly("Faculty"), removeSubjectController);


export default router;