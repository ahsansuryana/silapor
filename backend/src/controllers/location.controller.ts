import { Request, Response } from "express";
import { LocationsModel, LocationType } from "../models/locations.model";

export const getAll = async (_req: Request, res: Response) => {
  const locations = await LocationsModel.findAll();
  return res.json(locations);
};

export const getRootsWithChildren = async (_req: Request, res: Response) => {
  const tree = await LocationsModel.findRootsWithChildren();
  return res.json(tree);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const location = await LocationsModel.findById(id);
  if (!location) return res.status(404).json({ message: "Lokasi tidak ditemukan" });
  return res.json(location);
};

export const create = async (req: Request, res: Response) => {
  const { name, type, parent_id } = req.body as { name: string; type: LocationType; parent_id?: string };
  if (!name || !type) return res.status(400).json({ message: "Nama dan tipe wajib diisi" });

  const location = await LocationsModel.create({ name, type, parent_id });
  return res.status(201).json(location);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { name, type, parent_id } = req.body as { name?: string; type?: LocationType; parent_id?: string };
  const location = await LocationsModel.update(id, { name, type, parent_id });
  if (!location) return res.status(404).json({ message: "Lokasi tidak ditemukan" });
  return res.json(location);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const location = await LocationsModel.delete(id);
  if (!location) return res.status(404).json({ message: "Lokasi tidak ditemukan" });
  return res.json({ message: "Lokasi berhasil dihapus" });
};
