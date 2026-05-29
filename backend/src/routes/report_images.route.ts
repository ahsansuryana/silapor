import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getByReportId,
  upload,
  remove,
} from "../controllers/report_images.controller";

const router = Router();

router.get("/:id/images", authenticate, getByReportId);
router.post("/:id/images", authenticate, upload);
router.delete("/:id/images/:imageId", authenticate, remove);

export default router;