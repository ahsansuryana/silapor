import pool from "../lib/db";

export interface Notification {
  id: string;
  user_id: string;
  report_id: string;
  title: string | null;
  body: string | null;
  is_read: boolean | null;
  sent_at: Date;
  created_at: Date;
  updated_at: Date | null;
}

export const NotificationsModel = {
  findByUserId: async (userId: string, limit = 50, offset = 0) => {
    const { rows } = await pool.query<Notification>(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY sent_at DESC LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );
    return rows;
  },

  findUnreadByUserId: async (userId: string) => {
    const { rows } = await pool.query<Notification>(
      `SELECT * FROM notifications WHERE user_id = $1 AND is_read = false ORDER BY sent_at DESC`,
      [userId],
    );
    return rows;
  },

  getUnreadCount: async (userId: string) => {
    const { rows } = await pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false`,
      [userId],
    );
    return parseInt(rows[0].count, 10);
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<Notification>(
      `SELECT * FROM notifications WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  create: async (data: {
    user_id: string;
    report_id: string;
    title: string;
    body: string;
  }) => {
    const { rows } = await pool.query<Notification>(
      `INSERT INTO notifications (user_id, report_id, title, body)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.user_id, data.report_id, data.title, data.body],
    );
    return rows[0];
  },

  markAsRead: async (id: string) => {
    const { rows } = await pool.query<Notification>(
      `UPDATE notifications SET is_read = true, updated_at = now() WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },

  markAllAsRead: async (userId: string) => {
    const { rows } = await pool.query<Notification>(
      `UPDATE notifications SET is_read = true, updated_at = now() WHERE user_id = $1 RETURNING *`,
      [userId],
    );
    return rows;
  },

  delete: async (id: string) => {
    const { rows } = await pool.query<Notification>(
      `DELETE FROM notifications WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },

  deleteByReportId: async (reportId: string) => {
    const { rows } = await pool.query<Notification>(
      `DELETE FROM notifications WHERE report_id = $1 RETURNING *`,
      [reportId],
    );
    return rows;
  },
};
