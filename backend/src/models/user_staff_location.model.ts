import pool from "../lib/db";

export interface UserStaffLocation {
  id: string;
  staff_id: string;
  location_id: string;
  created_at: Date;
}

export interface UserStaffLocationWithDetails extends UserStaffLocation {
  staff_name: string;
  location_name: string;
  location_type: string;
}

export const UserStaffLocationModel = {
  findByStaffId: async (staffId: string) => {
    const { rows } = await pool.query<UserStaffLocationWithDetails>(
      `SELECT usl.*, u.name as staff_name, l.name as location_name, l.type as location_type
       FROM user_staff_location usl
       JOIN users u ON usl.staff_id = u.id
       JOIN locations l ON usl.location_id = l.id
       WHERE usl.staff_id = $1`,
      [staffId],
    );
    return rows;
  },

  findByLocationId: async (locationId: string) => {
    const { rows } = await pool.query<UserStaffLocationWithDetails>(
      `SELECT usl.*, u.name as staff_name, l.name as location_name, l.type as location_type
       FROM user_staff_location usl
       JOIN users u ON usl.staff_id = u.id
       JOIN locations l ON usl.location_id = l.id
       WHERE usl.location_id = $1`,
      [locationId],
    );
    return rows;
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<UserStaffLocation>(
      `SELECT * FROM user_staff_location WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  assign: async (data: { staff_id: string; location_id: string }) => {
    const { rows } = await pool.query<UserStaffLocation>(
      `INSERT INTO user_staff_location (staff_id, location_id)
       VALUES ($1, $2)
       ON CONFLICT (staff_id, location_id) DO NOTHING
       RETURNING *`,
      [data.staff_id, data.location_id],
    );
    return rows[0] || null;
  },

  remove: async (data: { staff_id: string; location_id: string }) => {
    const { rows } = await pool.query<UserStaffLocation>(
      `DELETE FROM user_staff_location WHERE staff_id = $1 AND location_id = $2 RETURNING *`,
      [data.staff_id, data.location_id],
    );
    return rows[0] || null;
  },

  removeByStaffId: async (staffId: string) => {
    const { rows } = await pool.query<UserStaffLocation>(
      `DELETE FROM user_staff_location WHERE staff_id = $1 RETURNING *`,
      [staffId],
    );
    return rows;
  },

  getStaffForAutoAssign: async (locationId: string) => {
    const { rows } = await pool.query<{ id: string; name: string }>(
      `SELECT u.id, u.name
       FROM user_staff_location usl
       JOIN users u ON usl.staff_id = u.id
       WHERE usl.location_id = $1 AND u.role = 'STAFF'
       LIMIT 1`,
      [locationId],
    );
    return rows[0] || null;
  },
};
