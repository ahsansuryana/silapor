import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getByStaffId,
  getMyLocations,
  assign,
  remove,
  getStaffForLocation,
} from "../controllers/user_staff_location.controller";

const router = Router();

router.get("/my", authenticate, getMyLocations);
router.get("/staff/:staffId", authenticate, getByStaffId);
router.get("/location/:locationId/staff", authenticate, getStaffForLocation);
router.post("/", authenticate, assign);
router.delete("/:staffId/:locationId", authenticate, remove);

export default router;