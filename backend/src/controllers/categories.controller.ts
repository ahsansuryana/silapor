import { Request, Response } from "express";
import { CategoriesModel } from "../models/categories.model";

export const getAll = async (_req: Request, res: Response) => {
  const categories = await CategoriesModel.findAll();
  return res.json(categories);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const category = await CategoriesModel.findById(id);
  if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
  return res.json(category);
};

export const create = async (req: Request, res: Response) => {
  const { name, short_description } = req.body;
  if (!name) return res.status(400).json({ message: "Nama kategori wajib diisi" });

  const existing = await CategoriesModel.findByName(name);
  if (existing) return res.status(409).json({ message: "Kategori sudah ada" });

  const category = await CategoriesModel.create({ name, short_description });
  return res.status(201).json(category);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { name, short_description } = req.body as { name?: string; short_description?: string };

  const category = await CategoriesModel.update(id, { name, short_description });
  if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
  return res.json(category);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const category = await CategoriesModel.delete(id);
  if (!category) return res.status(404).json({ message: "Kategori tidak ditemukan" });
  return res.json({ message: "Kategori berhasil dihapus" });
};