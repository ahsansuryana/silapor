import { Router } from "express";
import { authenticate, requireRole } from "../middlewares/auth.middleware";
import {
  getByReportId,
  getMyTasks,
  assign,
  transfer,
  autoAssign,
  getActiveAssignment,
} from "../controllers/staff_assignments.controller";

const router = Router();

router.get("/my-tasks", authenticate, requireRole("STAFF", "ADMIN"), getMyTasks);
router.get("/:reportId", authenticate, getByReportId);
router.get("/:reportId/active", authenticate, getActiveAssignment);
router.post("/", authenticate, requireRole("STAFF", "ADMIN"), assign);
router.post("/transfer", authenticate, requireRole("STAFF", "ADMIN"), transfer);
router.post("/auto-assign", authenticate, requireRole("STAFF", "ADMIN"), autoAssign);

export default router;