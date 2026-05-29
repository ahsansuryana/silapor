import pool from "../lib/db";

export interface ReportImage {
  id: string;
  report_id: string;
  minio_object_key: string;
  created_at: Date;
  updated_at: Date | null;
}

export const ReportImagesModel = {
  findByReportId: async (reportId: string) => {
    const { rows } = await pool.query<ReportImage>(
      `SELECT * FROM report_images WHERE report_id = $1 ORDER BY created_at`,
      [reportId],
    );
    return rows;
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<ReportImage>(
      `SELECT * FROM report_images WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  create: async (data: { report_id: string; minio_object_key: string }) => {
    const { rows } = await pool.query<ReportImage>(
      `INSERT INTO report_images (report_id, minio_object_key)
       VALUES ($1, $2)
       RETURNING *`,
      [data.report_id, data.minio_object_key],
    );
    return rows[0];
  },

  delete: async (id: string) => {
    const { rows } = await pool.query<ReportImage>(
      `DELETE FROM report_images WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },

  deleteByReportId: async (reportId: string) => {
    const { rows } = await pool.query<ReportImage>(
      `DELETE FROM report_images WHERE report_id = $1 RETURNING *`,
      [reportId],
    );
    return rows;
  },
};
