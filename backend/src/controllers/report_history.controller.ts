import { Request, Response } from "express";
import { ReportStatusHistoryModel } from "../models/report_status_history.model";

export const getByReportId = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const history = await ReportStatusHistoryModel.findByReportId(id);
  return res.json(history);
};

export const getById = async (req: Request, res: Response) => {
  const { id, historyId } = req.params as { id: string; historyId: string };
  const history = await ReportStatusHistoryModel.findById(historyId);
  if (!history || history.report_id !== id) {
    return res.status(404).json({ message: "Riwayat tidak ditemukan" });
  }
  return res.json(history);
};