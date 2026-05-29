import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getAll,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  remove,
} from "../controllers/notifications.controller";

const router = Router();

router.get("/", authenticate, getAll);
router.get("/unread-count", authenticate, getUnreadCount);
router.patch("/:id/read", authenticate, markAsRead);
router.patch("/read-all", authenticate, markAllAsRead);
router.delete("/:id", authenticate, remove);

export default router;