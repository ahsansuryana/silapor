import { Router } from "express";
import { authenticate, requireAdmin } from "../middlewares/auth.middleware";
import { UsersModel } from "../models/users.model";

const router = Router();

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await UsersModel.getAllMahasiswa();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { nim, name, password } = req.body;
    
    if (!nim || !name || !password) {
      return res.status(400).json({ message: "NIM, name, dan password wajib diisi" });
    }

    const existing = await UsersModel.findByNim(nim);
    if (existing) {
      return res.status(409).json({ message: "NIM sudah terdaftar" });
    }

    const user = await UsersModel.createMahasiswa({ nim, name, password });
    res.status(201).json({ message: "User berhasil dibuat", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    const { name, password } = req.body;

    const updated = await UsersModel.updateMahasiswa(id, { name, password });
    if (!updated) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.json({ message: "User berhasil diupdate", user: updated });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id as string;
    await UsersModel.deleteMahasiswa(id);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

export default router;