import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/categories.controller";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authenticate, create);
router.patch("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);

export default router;