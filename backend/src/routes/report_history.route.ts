import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getByReportId,
  getById,
} from "../controllers/report_history.controller";

const router = Router();

router.get("/:id/history", authenticate, getByReportId);
router.get("/:id/history/:historyId", authenticate, getById);

export default router;