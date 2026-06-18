import { Request, Response } from "express";
import { NotificationsModel } from "../models/notifications.model";

export const getAll = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { limit, offset } = req.query as { limit?: string; offset?: string };
  const notifications = await NotificationsModel.findByUserId(user.id, Number(limit) || 50, Number(offset) || 0);
  return res.json(notifications);
};

export const getUnreadCount = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const count = await NotificationsModel.getUnreadCount(user.id);
  return res.json({ count });
};

export const markAsRead = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params as { id: string };
  const notification = await NotificationsModel.findById(id);
  if (!notification) return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
  if (notification.user_id !== user.id) return res.status(403).json({ message: "Akses ditolak" });
  const updated = await NotificationsModel.markAsRead(id);
  return res.json(updated);
};

export const markAllAsRead = async (req: Request, res: Response) => {
  const user = (req as any).user;
  await NotificationsModel.markAllAsRead(user.id);
  return res.json({ message: "Semua notifikasi telah dibaca" });
};

export const remove = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id } = req.params as { id: string };
  const notification = await NotificationsModel.findById(id);
  if (!notification) return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
  if (notification.user_id !== user.id) return res.status(403).json({ message: "Akses ditolak" });
  await NotificationsModel.delete(id);
  return res.json({ message: "Notifikasi berhasil dihapus" });
};