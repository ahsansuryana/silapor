import { Router } from "express";
import multer from "multer";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const validateId = (req: any, res: any, next: any) => {
  if (req.params.id && !UUID_REGEX.test(req.params.id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }
  next();
};
import {
  getAll,
  getById,
  getMyReports,
  create,
  update,
  updateStatus,
  remove,
  getByStatus,
  getByPriority,
  getStats,
} from "../controllers/reports.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Hanya gambar yang diizinkan"));
    }
  },
});

router.get("/", authenticate, requireAdmin, getAll);
router.get("/my", authenticate, getMyReports);
router.get("/stats", authenticate, requireAdmin, getStats);
router.get("/status/:status", authenticate, getByStatus);
router.get("/priority/:priority", authenticate, getByPriority);
router.get("/:id", authenticate, validateId, getById);
router.post("/", authenticate, upload.single("file"), create);
router.patch("/:id", authenticate, validateId, update);
router.patch("/:id/status", authenticate, validateId, updateStatus);
router.delete("/:id", authenticate, validateId, remove);

export default router;