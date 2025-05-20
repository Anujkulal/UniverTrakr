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
import { authenticate, roleOnly } from "../../middlewares/authenticate.js";
import upload from "../../middlewares/multerMiddleware.js";
import { addStudentDetailsController, updateSelectedStudentPasswordController } from "../../controllers/studentController.js";

const router = express.Router();

router.post("/register", authenticate, roleOnly("Admin"), adminRegisterController);
router.post("/login", adminLoginController);
router.post("/logout", adminLogoutController);
router.put("/update-password", authenticate, roleOnly("Admin"), updateAdminLoggedInPasswordController);
router.put("/update-password/:userId", authenticate, roleOnly("Admin"), updateSelectedAdminPasswordController);

//Admin
router.post(
  "/add",
  authenticate,
  upload.single("profile"),
  roleOnly("Admin"),
  addAdminDetailsController
);
router.get("/get-allAdmins", authenticate, roleOnly("Admin"), getAllAdminDetailsController);
router.post("/get-adminById", authenticate, roleOnly("Admin"), getAdminByIdDetailsController);
router.get("/get-myDetail", authenticate, roleOnly("Admin"), getMyDetailsController);
router.put("/updateAdmin/:adminId", authenticate, roleOnly("Admin"), upload.single("profile"), updateAdminDetailsController);

//Faculty

//Student
router.put("/update-student-password/:userId", roleOnly("Admin"), authenticate, updateSelectedStudentPasswordController);
router.post(
  "/add-student",
  authenticate,
  roleOnly("Admin", "Faculty"),
  upload.single("profile"),
  addStudentDetailsController
);

export default router;
