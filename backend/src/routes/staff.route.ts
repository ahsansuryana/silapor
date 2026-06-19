import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { UsersModel } from "../models/users.model";

const router = Router();

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const staff = await UsersModel.getStaffWithLocations();
    res.json(staff);
  } catch (err) {
    console.error("Error fetching staff:", err);
    res.status(500).json({ message: "Failed to fetch staff" });
  }
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { name, password, locations } = req.body;

    const updated = await UsersModel.update(id, { name, password });
    if (!updated) return res.status(404).json({ message: "Staff not found" });

    if (locations && Array.isArray(locations)) {
      const pool = require("../lib/db").default;
      await pool.query("DELETE FROM user_staff_location WHERE staff_id = $1", [id]);
      for (const locationId of locations) {
        await pool.query(
          "INSERT INTO user_staff_location (staff_id, location_id) VALUES ($1, $2)",
          [id, locationId]
        );
      }
    }

    res.json({ message: "Staff updated successfully", user: updated });
  } catch (err) {
    console.error("Error updating staff:", err);
    res.status(500).json({ message: "Failed to update staff" });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await UsersModel.delete(id);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    console.error("Error deleting staff:", err);
    res.status(500).json({ message: "Failed to delete staff" });
  }
});

export default router;