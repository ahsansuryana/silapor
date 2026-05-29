import { Request, Response } from "express";
import { UserStaffLocationModel } from "../models/user_staff_location.model";
import { UsersModel } from "../models/users.model";

export const getByStaffId = async (req: Request, res: Response) => {
  const { staffId } = req.params as { staffId: string };
  const assignments = await UserStaffLocationModel.findByStaffId(staffId);
  return res.json(assignments);
};

export const getMyLocations = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const assignments = await UserStaffLocationModel.findByStaffId(user.id);
  return res.json(assignments);
};

export const assign = async (req: Request, res: Response) => {
  const { staff_id, location_id } = req.body as { staff_id: string; location_id: string };

  if (!staff_id || !location_id) {
    return res.status(400).json({ message: "staff_id dan location_id wajib diisi" });
  }

  const staff = await UsersModel.findById(staff_id);
  if (!staff || staff.role !== "STAFF") {
    return res.status(400).json({ message: "User bukan staff" });
  }

  const assignment = await UserStaffLocationModel.assign({ staff_id, location_id });
  if (!assignment) {
    return res.status(409).json({ message: "Mapping sudah ada" });
  }
  return res.status(201).json(assignment);
};

export const remove = async (req: Request, res: Response) => {
  const { staffId, locationId } = req.params as { staffId: string; locationId: string };
  const assignment = await UserStaffLocationModel.remove({ staff_id: staffId, location_id: locationId });
  if (!assignment) return res.status(404).json({ message: "Mapping tidak ditemukan" });
  return res.json({ message: "Mapping berhasil dihapus" });
};

export const getStaffForLocation = async (req: Request, res: Response) => {
  const { locationId } = req.params as { locationId: string };
  const staff = await UserStaffLocationModel.getStaffForAutoAssign(locationId);
  if (!staff) return res.status(404).json({ message: "Tidak ada staff untuk lokasi ini" });
  return res.json(staff);
};