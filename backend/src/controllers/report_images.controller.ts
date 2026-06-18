import { Request, Response } from "express";
import { ReportImagesModel } from "../models/report_images.model";
import { uploadToMinIO, deleteFromMinIO, getPresignedUrl } from "../lib/minio-upload";
import multer from "multer";
import minioClient, { BUCKET_NAME } from "../lib/minio";

const uploadMulter = multer({ storage: multer.memoryStorage() });

export const getByReportId = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const images = await ReportImagesModel.findByReportId(id);

  const imagesWithUrls = await Promise.all(
    images.map(async (img) => ({
      ...img,
      url: await getPresignedUrl(img.minio_object_key),
    })),
  );

  return res.json(imagesWithUrls);
};

export const upload = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const file = (req as any).file;

  if (!file) return res.status(400).json({ message: "File wajib diupload" });

  const objectKey = await uploadToMinIO(file.buffer, file.originalname);
  const image = await ReportImagesModel.create({ report_id: id, minio_object_key: objectKey });

  return res.status(201).json(image);
};

export const remove = async (req: Request, res: Response) => {
  const { imageId } = req.params as { imageId: string };
  const image = await ReportImagesModel.findById(imageId);
  if (!image) return res.status(404).json({ message: "Gambar tidak ditemukan" });

  await deleteFromMinIO(image.minio_object_key);
  await ReportImagesModel.delete(imageId);

  return res.json({ message: "Gambar berhasil dihapus" });
};

export const serveImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params as { imageId: string };
    const image = await ReportImagesModel.findById(imageId);
    if (!image) return res.status(404).json({ message: "Gambar tidak ditemukan" });

    const stream = await minioClient.getObject(BUCKET_NAME, image.minio_object_key);
    const ext = image.minio_object_key.split('.').pop() || 'jpg';
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    res.setHeader('Content-Type', mime);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    stream.pipe(res);
  } catch (err) {
    console.error('[IMAGE] Failed to serve:', err);
    res.status(500).json({ message: "Gagal memuat gambar" });
  }
};
