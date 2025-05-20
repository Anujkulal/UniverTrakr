import express from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { studentLoginController, studentLogoutController, studentRegisterController, updateStudentLoggedInPasswordController } from '../../controllers/studentController.js';

const router = express.Router();

router.post('/register', studentRegisterController);
router.post('/login', studentLoginController);
router.post('/logout', studentLogoutController);
router.put("/update-password", authenticate, updateStudentLoggedInPasswordController);


export default router;