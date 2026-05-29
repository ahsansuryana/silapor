import pool from "../lib/db";
import bcrypt from "bcrypt";

export type UserRole = "MAHASISWA" | "STAFF" | "ADMIN";

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  avatar_file_id: string | null;
  "NIM": string | null;
  password: string | null;
  role: UserRole;
  is_google: boolean;
  created_at: Date;
  updated_at: Date | null;
}

export const UsersModel = {
  findByEmail: async (email: string) => {
    const { rows } = await pool.query<User>(
      `SELECT * FROM users WHERE email = $1`,
      [email],
    );
    return rows[0] || null;
  },

  findByNim: async (nim: string) => {
    const { rows } = await pool.query<User>(
      `SELECT * FROM users WHERE "NIM" = $1`,
      [nim],
    );
    return rows[0] || null;
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<User>(
      `SELECT * FROM users WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  createLocal: async (data: {
    nim: string;
    name: string;
    password: string;
    role?: UserRole;
  }) => {
    const role = data.role || "MAHASISWA";
    const { rows } = await pool.query<User>(
      `INSERT INTO users ("NIM", name, password, role, is_google)
       VALUES ($1, $2, $3, $4, false) RETURNING *`,
      [data.nim, data.name, data.password, role],
    );
    return rows[0];
  },

  createGoogle: async (data: {
    email: string;
    name: string;
    avatar_url: string;
  }) => {
    const { rows } = await pool.query<User>(
      `INSERT INTO users (email, name, avatar_url, is_google)
       VALUES ($1, $2, $3, true) RETURNING *`,
      [data.email, data.name, data.avatar_url],
    );
    return rows[0];
  },

  getAllStaff: async () => {
    const { rows } = await pool.query<User>(
      `SELECT * FROM users WHERE role = 'STAFF' ORDER BY created_at DESC`
    );
    return rows;
  },

  getStaffWithLocations: async () => {
    const { rows } = await pool.query(`
      SELECT 
        u.id, u."NIM", u.name, u.email, u.role, u.created_at,
        json_agg(
          json_build_object('id', l.id, 'name', l.name, 'type', l.type)
        ) FILTER (WHERE l.id IS NOT NULL) as locations
      FROM users u
      LEFT JOIN user_staff_location usl ON u.id = usl.staff_id
      LEFT JOIN locations l ON usl.location_id = l.id
      WHERE u.role = 'STAFF'
      GROUP BY u.id, u."NIM", u.name, u.email, u.role, u.created_at
      ORDER BY u.created_at DESC
    `);
    return rows;
  },

  update: async (id: string, data: { name?: string; password?: string }) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      updates.push(`password = $${paramIndex++}`);
      values.push(hashed);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(", ")}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  delete: async (id: string) => {
    await pool.query("DELETE FROM user_staff_location WHERE staff_id = $1", [id]);
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  },

  getAllMahasiswa: async () => {
    const { rows } = await pool.query<User>(
      `SELECT id, "NIM", name, email, role, is_google, created_at 
       FROM users WHERE role = 'MAHASISWA' ORDER BY created_at DESC`
    );
    return rows;
  },

  getMahasiswaById: async (id: string) => {
    const { rows } = await pool.query<User>(
      `SELECT id, "NIM", name, email, role, is_google, created_at 
       FROM users WHERE id = $1 AND role = 'MAHASISWA'`,
      [id]
    );
    return rows[0] || null;
  },

  createMahasiswa: async (data: { nim: string; name: string; password: string }) => {
    const hashed = await bcrypt.hash(data.password, 10);
    const { rows } = await pool.query<User>(
      `INSERT INTO users ("NIM", name, password, role, is_google)
       VALUES ($1, $2, $3, 'MAHASISWA', false) RETURNING id, "NIM", name, email, role`,
      [data.nim, data.name, hashed]
    );
    return rows[0];
  },

  updateMahasiswa: async (id: string, data: { name?: string; password?: string }) => {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      updates.push(`password = $${paramIndex++}`);
      values.push(hashed);
    }

    if (updates.length === 0) return null;

    values.push(id);
    const { rows } = await pool.query(
      `UPDATE users SET ${updates.join(", ")}, updated_at = NOW() 
       WHERE id = $${paramIndex} AND role = 'MAHASISWA' 
       RETURNING id, "NIM", name, email, role`,
      values
    );
    return rows[0] || null;
  },

  deleteMahasiswa: async (id: string) => {
    await pool.query("DELETE FROM users WHERE id = $1 AND role = 'MAHASISWA'", [id]);
  },
};
