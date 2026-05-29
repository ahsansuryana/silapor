import pool from "../lib/db";

export interface StaffReportAssignment {
  id: string;
  report_id: string;
  assigned_to: string;
  assigned_by: string | null;
  is_active: boolean;
  is_auto_assign: boolean;
  notes: string;
  created_at: Date;
  updated_at: Date | null;
}

export interface AssignmentWithDetails extends StaffReportAssignment {
  assigned_to_name: string;
  assigned_by_name: string | null;
}

export const StaffReportAssignmentsModel = {
  findByReportId: async (reportId: string) => {
    const { rows } = await pool.query<StaffReportAssignment>(
      `SELECT * FROM staff_report_assigments WHERE report_id = $1 ORDER BY created_at DESC`,
      [reportId],
    );
    return rows;
  },

  findActiveByReportId: async (reportId: string) => {
    const { rows } = await pool.query<StaffReportAssignment>(
      `SELECT * FROM staff_report_assigments WHERE report_id = $1 AND is_active = true`,
      [reportId],
    );
    return rows[0] || null;
  },

  findByStaffId: async (staffId: string, limit = 50, offset = 0) => {
    const { rows } = await pool.query<StaffReportAssignment>(
      `SELECT * FROM staff_report_assigments WHERE assigned_to = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [staffId, limit, offset],
    );
    return rows;
  },

  findActiveByStaffId: async (staffId: string) => {
    const { rows } = await pool.query(
      `SELECT 
        r.id, r.title, r.description, r.status, r.priority, r.created_at, r.updated_at,
        r.reporter_id, r.location_id, r.category_id,
        c.name as category_name,
        l.name as location_name,
        u.name as reporter_name
       FROM staff_report_assigments sra
       JOIN reports r ON sra.report_id = r.id
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN locations l ON r.location_id = l.id
       LEFT JOIN users u ON r.reporter_id = u.id
       WHERE sra.assigned_to = $1 AND sra.is_active = true
       ORDER BY sra.created_at DESC`,
      [staffId],
    );
    return rows;
  },

  assign: async (data: {
    report_id: string;
    assigned_to: string;
    assigned_by?: string;
    is_auto_assign?: boolean;
    notes?: string;
  }) => {
    await pool.query(
      `UPDATE staff_report_assigments SET is_active = false WHERE report_id = $1`,
      [data.report_id],
    );

    const { rows } = await pool.query<StaffReportAssignment>(
      `INSERT INTO staff_report_assigments (report_id, assigned_to, assigned_by, is_active, is_auto_assign, notes)
       VALUES ($1, $2, $3, true, $4, $5)
       RETURNING *`,
      [
        data.report_id,
        data.assigned_to,
        data.assigned_by || null,
        data.is_auto_assign || false,
        data.notes || "",
      ],
    );
    return rows[0];
  },

  transfer: async (data: {
    report_id: string;
    assigned_to: string;
    assigned_by: string;
    notes?: string;
  }) => {
    return StaffReportAssignmentsModel.assign({
      report_id: data.report_id,
      assigned_to: data.assigned_to,
      assigned_by: data.assigned_by,
      is_auto_assign: false,
      notes: data.notes,
    });
  },

  deactivate: async (id: string) => {
    const { rows } = await pool.query<StaffReportAssignment>(
      `UPDATE staff_report_assigments SET is_active = false WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },
};
