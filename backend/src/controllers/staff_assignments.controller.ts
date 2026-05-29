import { Request, Response } from "express";
import { StaffReportAssignmentsModel } from "../models/staff_report_assigments.model";
import { ReportsModel } from "../models/reports.model";
import { UserStaffLocationModel } from "../models/user_staff_location.model";
import { NotificationsModel } from "../models/notifications.model";
import { sendPush } from "../lib/push-notification";

export const getByReportId = async (req: Request, res: Response) => {
  const { reportId } = req.params as { reportId: string };
  const assignments = await StaffReportAssignmentsModel.findByReportId(reportId);
  return res.json(assignments);
};

export const getMyTasks = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const assignments = await StaffReportAssignmentsModel.findActiveByStaffId(user.id);
  return res.json(assignments);
};

export const assign = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { report_id, assigned_to, notes } = req.body as { report_id: string; assigned_to: string; notes?: string };

  const report = await ReportsModel.findById(report_id);
  if (!report) return res.status(404).json({ message: "Laporan tidak ditemukan" });

  if (!assigned_to) return res.status(400).json({ message: "Staff tujuan wajib diisi" });

  const assignment = await StaffReportAssignmentsModel.assign({
    report_id,
    assigned_to,
    assigned_by: user.id,
    notes,
  });

  await ReportsModel.updateStatus(report_id, "diterima");

  await NotificationsModel.create({
    user_id: assigned_to,
    report_id,
    title: "Laporan Baru Ditugaskan",
    body: `Anda ditugaskan untuk menangani laporan "${report.title}"`,
  });
  await sendPush(assigned_to, "Laporan Baru Ditugaskan", `Anda ditugaskan untuk menangani laporan "${report.title}"`, `/report/${report_id}`);

  return res.status(201).json(assignment);
};

export const transfer = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { report_id, assigned_to, notes } = req.body as { report_id: string; assigned_to: string; notes?: string };

  const report = await ReportsModel.findById(report_id);
  if (!report) return res.status(404).json({ message: "Laporan tidak ditemukan" });

  if (!assigned_to) return res.status(400).json({ message: "Staff tujuan wajib diisi" });

  const oldAssignment = await StaffReportAssignmentsModel.findActiveByReportId(report_id);
  if (oldAssignment) {
    await NotificationsModel.create({
      user_id: oldAssignment.assigned_to,
      report_id,
      title: "Laporan Ditransfer",
      body: `Laporan "${report.title}" ditransfer ke staff lain`,
    });
  }

  const assignment = await StaffReportAssignmentsModel.transfer({
    report_id,
    assigned_to,
    assigned_by: user.id,
    notes,
  });

  await NotificationsModel.create({
    user_id: assigned_to,
    report_id,
    title: "Laporan Baru Ditugaskan",
    body: `Anda ditugaskan untuk menangani laporan "${report.title}"`,
  });
  await sendPush(assigned_to, "Laporan Baru Ditugaskan", `Anda ditugaskan untuk menangani laporan "${report.title}"`, `/report/${report_id}`);

  return res.status(201).json(assignment);
};

export const autoAssign = async (req: Request, res: Response) => {
  const { report_id } = req.body as { report_id: string };

  const report = await ReportsModel.findById(report_id);
  if (!report) return res.status(404).json({ message: "Laporan tidak ditemukan" });

  const staff = await UserStaffLocationModel.getStaffForAutoAssign(report.location_id);
  if (!staff) return res.status(400).json({ message: "Tidak ada staff untuk lokasi ini" });

  const assignment = await StaffReportAssignmentsModel.assign({
    report_id,
    assigned_to: staff.id,
    is_auto_assign: true,
    notes: "Auto-assign berdasarkan lokasi",
  });

  await ReportsModel.updateStatus(report_id, "diterima");

  return res.status(201).json(assignment);
};

export const getActiveAssignment = async (req: Request, res: Response) => {
  const { reportId } = req.params as { reportId: string };
  const assignment = await StaffReportAssignmentsModel.findActiveByReportId(reportId);
  if (!assignment) return res.status(404).json({ message: "Tidak ada assignment aktif" });
  return res.json(assignment);
};