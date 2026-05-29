import { Request, Response } from "express";
import { ReportImagesModel } from "../models/report_images.model";
import { ReportsModel } from "../models/reports.model";

export const getByReportId = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const images = await ReportImagesModel.findByReportId(id);
  return res.json(images);
};

export const upload = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { minio_object_key } = req.body as { minio_object_key: string };

  const report = await ReportsModel.findById(id);
  if (!report) return res.status(404).json({ message: "Laporan tidak ditemukan" });

  if (!minio_object_key) return res.status(400).json({ message: "minio_object_key wajib diisi" });

  const image = await ReportImagesModel.create({ report_id: id, minio_object_key });
  return res.status(201).json(image);
};

export const remove = async (req: Request, res: Response) => {
  const { id, imageId } = req.params as { id: string; imageId: string };

  const image = await ReportImagesModel.findById(imageId);
  if (!image || image.report_id !== id) {
    return res.status(404).json({ message: "Gambar tidak ditemukan" });
  }

  await ReportImagesModel.delete(imageId);
  return res.json({ message: "Gambar berhasil dihapus" });
};