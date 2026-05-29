import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getByReportId,
  getMyTasks,
  assign,
  transfer,
  autoAssign,
  getActiveAssignment,
} from "../controllers/staff_assignments.controller";

const router = Router();

router.get("/my-tasks", authenticate, getMyTasks);
router.get("/:reportId", authenticate, getByReportId);
router.get("/:reportId/active", authenticate, getActiveAssignment);
router.post("/", authenticate, assign);
router.post("/transfer", authenticate, transfer);
router.post("/auto-assign", authenticate, autoAssign);

export default router;