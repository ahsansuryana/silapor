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

// Simple in-memory rate limiter for login
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const loginLimiter = (req: any, res: any, next: any) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  
  if (entry && now < entry.resetAt) {
    if (entry.count >= 10) {
      return res.status(429).json({ message: "Terlalu banyak percobaan login. Coba lagi nanti." });
    }
    entry.count++;
  } else {
    loginAttempts.set(ip, { count: 1, resetAt: now + 60000 });
  }
  
  next();
};

const router = Router();

router.post("/register", register);
router.post("/register/staff", authenticate, requireAdmin, registerStaff);
router.post("/register/admin", registerAdmin); // TEMPORARY: No auth for initial setup
router.post("/update-role", updateRole); // TEMPORARY: For initial setup
router.post("/login", loginLimiter, login);
router.get("/google/redirect", googleRedirect);
router.get("/google/callback", googleCallback);
router.post("/refresh", refresh);
router.put("/profile", authenticate, updateProfile);
router.post("/logout", authenticate, logout);
router.post("/fcm-token", authenticate, registerFcmToken);
router.delete("/fcm-token", authenticate, deleteFcmToken);

export default router;
