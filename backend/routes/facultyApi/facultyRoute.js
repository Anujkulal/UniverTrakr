import express from "express";
import { facultyLoginController, facultyLogoutController, facultyRegisterController } from "../../controllers/facultyController.js";
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import { addStudentDetailsController } from "../../controllers/studentController.js";
import upload from "../../middlewares/multerMiddleware.js";

const router = express.Router();

//Faculty
router.post('/register', authenticate, roleOnly("Admin", "Faculty"), facultyRegisterController);
router.post('/login', facultyLoginController);
router.post('/logout', facultyLogoutController);

//student
router.post(
  "/add-student",
  authenticate,
  roleOnly("Faculty"),
  upload.single("profile"),
  addStudentDetailsController
);

export default router;