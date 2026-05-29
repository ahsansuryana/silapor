import pool from "../lib/db";

export type ReportStatus = "menunggu" | "diterima" | "diproses" | "selesai" | "ditolak";

export interface ReportStatusHistory {
  id: string;
  report_id: string;
  change_by: string;
  old_status: ReportStatus | null;
  new_status: ReportStatus;
  notes: string | null;
  changed_at: Date;
  created_at: Date;
  updated_dt: Date | null;
}

export const ReportStatusHistoryModel = {
  findByReportId: async (reportId: string) => {
    const { rows } = await pool.query<ReportStatusHistory>(
      `SELECT * FROM report_status_history WHERE report_id = $1 ORDER BY changed_at DESC`,
      [reportId],
    );
    return rows;
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<ReportStatusHistory>(
      `SELECT * FROM report_status_history WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  create: async (data: {
    report_id: string;
    change_by: string;
    old_status?: ReportStatus | null;
    new_status: ReportStatus;
    notes?: string;
  }) => {
    const { rows } = await pool.query<ReportStatusHistory>(
      `INSERT INTO report_status_history (report_id, change_by, old_status, new_status, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.report_id,
        data.change_by,
        data.old_status || null,
        data.new_status,
        data.notes || null,
      ],
    );
    return rows[0];
  },

  delete: async (id: string) => {
    const { rows } = await pool.query<ReportStatusHistory>(
      `DELETE FROM report_status_history WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },
};
