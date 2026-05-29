import { Request, Response } from "express";
import {
  ReportsModel,
  ReportStatus,
  ReportPriority,
} from "../models/reports.model";
import { ReportStatusHistoryModel } from "../models/report_status_history.model";
import { StaffReportAssignmentsModel } from "../models/staff_report_assigments.model";
import { NotificationsModel } from "../models/notifications.model";
import { ReportImagesModel } from "../models/report_images.model";
import { LocationsModel } from "../models/locations.model";
import { uploadToMinIO, getPresignedUrl } from "../lib/minio-upload";
import { sendPush } from "../lib/push-notification";

export const getAll = async (req: Request, res: Response) => {
  const { limit, offset } = req.query as { limit?: string; offset?: string };
  const reports = await ReportsModel.findWithDetails(
    Number(limit) || 50,
    Number(offset) || 0,
  );

  const reportsWithImages = await Promise.all(
    reports.map(async (report) => {
      const imagesWithUrls = await Promise.all(
        report.images.map(async (img) => ({
          ...img,
          url: await getPresignedUrl(img.minio_object_key),
        })),
      );
      return { ...report, images: imagesWithUrls };
    }),
  );

  return res.json(reportsWithImages);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const report = await ReportsModel.findByIdWithDetails(id);
  if (!report)
    return res.status(404).json({ message: "Laporan tidak ditemukan" });

  const imagesWithUrls = await Promise.all(
    report.images.map(async (img) => ({
      ...img,
      url: await getPresignedUrl(img.minio_object_key),
    })),
  );

  return res.json({ ...report, images: imagesWithUrls });
};

export const getMyReports = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { limit, offset } = req.query as { limit?: string; offset?: string };
  const reports = await ReportsModel.findByReporterWithDetails(user.id);

  const reportsWithImages = await Promise.all(
    reports.map(async (report) => {
      const imagesWithUrls = await Promise.all(
        report.images.map(async (img) => ({
          ...img,
          url: await getPresignedUrl(img.minio_object_key),
        })),
      );
      return { ...report, images: imagesWithUrls };
    }),
  );

  return res.json(reportsWithImages);
};

export const create = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const file = (req as any).file;

  const { location_id, category_id, title, description, priority } =
    req.body as {
      location_id: string;
      category_id: string;
      title: string;
      description?: string;
      priority?: ReportPriority;
    };

  if (!location_id || !category_id || !title) {
    return res
      .status(400)
      .json({ message: "Location, category, dan title wajib diisi" });
  }

  const report = await ReportsModel.create({
    reporter_id: user.id,
    location_id,
    category_id,
    title,
    description,
    priority,
  });

  if (file) {
    const objectKey = await uploadToMinIO(file.buffer, file.originalname);
    await ReportImagesModel.create({
      report_id: report.id,
      minio_object_key: objectKey,
    });
  }

  // Auto-assign ke staff berdasarkan hierarki lokasi
  const assignedStaff = await LocationsModel.findStaffInHierarchy(location_id);
  if (assignedStaff) {
    await StaffReportAssignmentsModel.assign({
      report_id: report.id,
      assigned_to: assignedStaff.id,
      assigned_by: undefined,
      is_auto_assign: true,
      notes: `Auto-assigned ke ${assignedStaff.name} berdasarkan hierarki lokasi`,
    });
    
    // Kirim notifikasi ke staff (in-app + push)
    await NotificationsModel.create({
      user_id: assignedStaff.id,
      report_id: report.id,
      title: "Laporan Baru",
      body: `Ada laporan baru: ${title}`,
    });
    await sendPush(assignedStaff.id, "Laporan Baru", `Ada laporan baru: ${title}`, `/report/${report.id}`);
  }

  return res.status(201).json(report);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { title, description, priority } = req.body as {
    title?: string;
    description?: string;
    priority?: ReportPriority;
  };

  const report = await ReportsModel.update(id, {
    title,
    description,
    priority,
  });
  if (!report)
    return res.status(404).json({ message: "Laporan tidak ditemukan" });
  return res.json(report);
};

export const updateStatus = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params as { id: string };
  const { status, notes } = req.body as {
    status: ReportStatus;
    notes?: string;
  };

  const existing = await ReportsModel.findById(id);
  if (!existing)
    return res.status(404).json({ message: "Laporan tidak ditemukan" });

  const oldStatus = existing.status;
  await ReportsModel.updateStatus(id, status);

  await ReportStatusHistoryModel.create({
    report_id: id,
    change_by: user.id,
    old_status: oldStatus,
    new_status: status,
    notes,
  });

  // Notif ke reporter (in-app + push)
  await NotificationsModel.create({
    user_id: existing.reporter_id,
    report_id: id,
    title: "Status Laporan Diupdate",
    body: `Laporan "${existing.title}" statusnya berubah menjadi ${status}`,
  });
  await sendPush(existing.reporter_id, "Status Laporan Diupdate", `Laporan "${existing.title}" statusnya berubah menjadi ${status}`, `/report/${id}`);

  const activeAssignment =
    await StaffReportAssignmentsModel.findActiveByReportId(id);
  if (activeAssignment && activeAssignment.assigned_to !== user.id) {
    await NotificationsModel.create({
      user_id: activeAssignment.assigned_to,
      report_id: id,
      title: "Status Laporan Diupdate",
      body: `Laporan "${existing.title}" statusnya berubah ke ${status}`,
    });
    await sendPush(activeAssignment.assigned_to, "Status Laporan Diupdate", `Laporan "${existing.title}" statusnya berubah ke ${status}`, `/report/${id}`);
  }

  return res.json({ message: "Status berhasil diupdate" });
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const report = await ReportsModel.delete(id);
  if (!report)
    return res.status(404).json({ message: "Laporan tidak ditemukan" });
  return res.json({ message: "Laporan berhasil dihapus" });
};

export const getByStatus = async (req: Request, res: Response) => {
  const { status } = req.params as { status: ReportStatus };
  const { limit, offset } = req.query as { limit?: string; offset?: string };
  const reports = await ReportsModel.findByStatus(
    status,
    Number(limit) || 50,
    Number(offset) || 0,
  );
  return res.json(reports);
};

export const getByPriority = async (req: Request, res: Response) => {
  const { priority } = req.params as { priority: ReportPriority };
  const { limit, offset } = req.query as { limit?: string; offset?: string };
  const reports = await ReportsModel.findByPriority(
    priority,
    Number(limit) || 50,
    Number(offset) || 0,
  );
  return res.json(reports);
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await ReportsModel.getStats();
    return res.json(stats);
  } catch (err) {
    console.error("Error fetching stats:", err);
    return res.status(500).json({ message: "Failed to fetch stats" });
  }
};
