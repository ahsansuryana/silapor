import { Router } from "express";
import {
  register,
  login,
  googleRedirect,
  googleCallback,
  refresh,
  logout,
  registerStaff,
  registerAdmin,
  updateRole,
  registerFcmToken,
  deleteFcmToken,
  updateProfile,
} from "../controllers/auth.controller";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/register/staff", authenticate, requireAdmin, registerStaff);
router.post("/register/admin", registerAdmin); // TEMPORARY: No auth for initial setup
router.post("/update-role", updateRole); // TEMPORARY: For initial setup
router.post("/login", login);
router.get("/google/redirect", googleRedirect);
router.get("/google/callback", googleCallback);
router.post("/refresh", refresh);
router.put("/profile", authenticate, updateProfile);
router.post("/logout", logout);
router.post("/fcm-token", authenticate, registerFcmToken);
router.delete("/fcm-token", authenticate, deleteFcmToken);

export default router;
