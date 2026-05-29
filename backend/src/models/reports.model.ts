import pool from "../lib/db";
import { ReportImage } from "./report_images.model";

export type ReportStatus =
  | "menunggu"
  | "diterima"
  | "diproses"
  | "selesai"
  | "ditolak";
export type ReportPriority = "rendah" | "sedang" | "tinggi";

export interface Report {
  id: string;
  reporter_id: string;
  location_id: string;
  category_id: string;
  title: string;
  description: string | null;
  status: ReportStatus;
  priority: ReportPriority;
  created_at: Date;
  updated_at: Date | null;
}

export interface ReportWithDetails extends Report {
  reporter_name: string;
  location_name: string;
  category_name: string;
  images: ReportImage[];
}

export const ReportsModel = {
  findAll: async (limit = 50, offset = 0) => {
    const { rows } = await pool.query<Report>(
      `SELECT * FROM reports ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return rows;
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<Report>(
      `SELECT * FROM reports WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  findByReporter: async (reporterId: string, limit = 50, offset = 0) => {
    const { rows } = await pool.query<Report>(
      `SELECT * FROM reports WHERE reporter_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [reporterId, limit, offset],
    );
    return rows;
  },

  findByReporterWithDetails: async (reporterId: string) => {
    const { rows } = await pool.query<ReportWithDetails>(
      `SELECT 
        r.*,
        u.name as reporter_name,
        l.name as location_name,
        c.name as category_name,
        COALESCE(array_agg(
          json_build_object(
            'id', ri.id,
            'report_id', ri.report_id,
            'minio_object_key', ri.minio_object_key,
            'created_at', ri.created_at,
            'updated_at', ri.updated_at
          )
        ) FILTER (WHERE ri.id IS NOT NULL), '{}') as images
        FROM reports r
        JOIN users u ON r.reporter_id = u.id
        JOIN locations l ON r.location_id = l.id
        JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_images ri ON r.id = ri.report_id
        WHERE r.reporter_id = $1
        GROUP BY r.id, u.name, l.name, c.name
        ORDER BY r.created_at DESC`,
      [reporterId],
    );
    return rows;
  },

  findByStatus: async (status: ReportStatus, limit = 50, offset = 0) => {
    const { rows } = await pool.query<Report>(
      `SELECT * FROM reports WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [status, limit, offset],
    );
    return rows;
  },

  findByPriority: async (priority: ReportPriority, limit = 50, offset = 0) => {
    const { rows } = await pool.query<Report>(
      `SELECT * FROM reports WHERE priority = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [priority, limit, offset],
    );
    return rows;
  },

  findWithDetails: async (limit = 50, offset = 0) => {
    const { rows } = await pool.query<ReportWithDetails>(
      `SELECT 
        r.*,
        u.name as reporter_name,
        l.name as location_name,
        c.name as category_name,
        COALESCE(array_agg(
          json_build_object(
            'id', ri.id,
            'report_id', ri.report_id,
            'minio_object_key', ri.minio_object_key,
            'created_at', ri.created_at,
            'updated_at', ri.updated_at
          )
        ) FILTER (WHERE ri.id IS NOT NULL), '{}') as images
        FROM reports r
        JOIN users u ON r.reporter_id = u.id
        JOIN locations l ON r.location_id = l.id
        JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_images ri ON r.id = ri.report_id
        GROUP BY r.id, u.name, l.name, c.name
        ORDER BY r.created_at DESC 
        LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return rows;
  },

  findByIdWithDetails: async (id: string) => {
    const { rows } = await pool.query<ReportWithDetails>(
      `SELECT 
        r.*,
        u.name as reporter_name,
        l.name as location_name,
        c.name as category_name,
        COALESCE(array_agg(
          json_build_object(
            'id', ri.id,
            'report_id', ri.report_id,
            'minio_object_key', ri.minio_object_key,
            'created_at', ri.created_at,
            'updated_at', ri.updated_at
          )
        ) FILTER (WHERE ri.id IS NOT NULL), '{}') as images
        FROM reports r
        JOIN users u ON r.reporter_id = u.id
        JOIN locations l ON r.location_id = l.id
        JOIN categories c ON r.category_id = c.id
        LEFT JOIN report_images ri ON r.id = ri.report_id
        WHERE r.id = $1
        GROUP BY r.id, u.name, l.name, c.name`,
      [id],
    );
    return rows[0] || null;
  },

  create: async (data: {
    reporter_id: string;
    location_id: string;
    category_id: string;
    title: string;
    description?: string;
    priority?: ReportPriority;
  }) => {
    const { rows } = await pool.query<Report>(
      `INSERT INTO reports (reporter_id, location_id, category_id, title, description, priority)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        data.reporter_id,
        data.location_id,
        data.category_id,
        data.title,
        data.description || null,
        data.priority || "rendah",
      ],
    );
    return rows[0];
  },

  update: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      priority?: ReportPriority;
    },
  ) => {
    const { rows } = await pool.query<Report>(
      `UPDATE reports
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           priority = COALESCE($3, priority),
           updated_at = now()
       WHERE id = $4
       RETURNING *`,
      [data.title || null, data.description || null, data.priority || null, id],
    );
    return rows[0] || null;
  },

  updateStatus: async (id: string, status: ReportStatus) => {
    const { rows } = await pool.query<Report>(
      `UPDATE reports
       SET status = $1, updated_at = now()
       WHERE id = $2
       RETURNING *`,
      [status, id],
    );
    return rows[0] || null;
  },

  delete: async (id: string) => {
    const { rows } = await pool.query<Report>(
      `DELETE FROM reports WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },

  getStats: async () => {
    // All metrics - last 7 days
    const sevenDaysAgo = "NOW() - INTERVAL '7 days'";
    
    // Get total count for last 7 days
    const { rows: totalData } = await pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM reports WHERE created_at >= ${sevenDaysAgo}`
    );
    const total = parseInt(totalData[0]?.count || '0');

    // Get status counts for last 7 days
    const { rows: statusCounts } = await pool.query<{ status: string; count: string }>(
      `SELECT status, COUNT(*) as count FROM reports 
       WHERE created_at >= ${sevenDaysAgo}
       GROUP BY status`
    );

    const statusMap: Record<string, number> = {};
    statusCounts.forEach(s => {
      statusMap[s.status] = parseInt(s.count);
    });

    // Previous week for comparison
    const { rows: prevWeek } = await pool.query<{ count: string }>(
      `SELECT COUNT(*) as count FROM reports 
       WHERE created_at >= NOW() - INTERVAL '14 days' 
       AND created_at < NOW() - INTERVAL '7 days'`
    );
    const prevCount = parseInt(prevWeek[0]?.count || '0');
    
    let percentage = 0;
    if (prevCount > 0) {
      percentage = Math.round(((total - prevCount) / prevCount) * 100);
    }

    // Get daily data for chart
    const { rows: dailyData } = await pool.query<{ day: string; count: number }>(
      `SELECT DATE(created_at) as day, COUNT(*) as count
       FROM reports
       WHERE created_at >= ${sevenDaysAgo}
       GROUP BY DATE(created_at)
       ORDER BY day ASC`
    );

    const result: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const found = dailyData.find(d => d.day && d.day.toString().split('T')[0] === dateStr);
      result.push(found ? Number(found.count) : 0);
    }

    return {
      weeklyData: result,
      percentage,
      total,
      pending: statusMap['menunggu'] || 0,
      inProgress: statusMap['diproses'] || 0,
      resolved: statusMap['selesai'] || 0,
    };
  },
};
