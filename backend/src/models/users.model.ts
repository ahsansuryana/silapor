import pool from "../lib/db";

export interface User {
  id: string;
  name: string;
  email: string | null;
  nim: string | null;
  password: string | null;
  avatar_url: string | null;
  avatar_file_id: string | null;
  role: "MAHASISWA" | "STAFF" | "ADMIN";
  is_google: boolean;
  created_at: Date;
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
      `SELECT * FROM users WHERE nim = $1`,
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
  }) => {
    const { rows } = await pool.query<User>(
      `INSERT INTO users (nim, name, password, is_google)
       VALUES ($1, $2, $3, false) RETURNING *`,
      [data.nim, data.name, data.password],
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
};
