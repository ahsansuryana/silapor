import pool from "../lib/db";

export type Category = {
  id: string;
  name: string;
  short_description: string | null;
  created_at: Date;
  updated_at: Date | null;
};

export const CategoriesModel = {
  findAll: async () => {
    const { rows } = await pool.query<Category>(
      `SELECT * FROM categories ORDER BY name`,
    );
    return rows;
  },

  findById: async (id: string) => {
    const { rows } = await pool.query<Category>(
      `SELECT * FROM categories WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  findByName: async (name: string) => {
    const { rows } = await pool.query<Category>(
      `SELECT * FROM categories WHERE name = $1`,
      [name],
    );
    return rows[0] || null;
  },

  create: async (data: { name: string; short_description?: string }) => {
    const { rows } = await pool.query<Category>(
      `INSERT INTO categories (name, short_description)
       VALUES ($1, $2)
       RETURNING *`,
      [data.name, data.short_description || null],
    );
    return rows[0];
  },

  update: async (
    id: string,
    data: { name?: string; short_description?: string },
  ) => {
    const { rows } = await pool.query<Category>(
      `UPDATE categories
       SET name = COALESCE($1, name),
           short_description = COALESCE($2, short_description),
           updated_at = now()
       WHERE id = $3
       RETURNING *`,
      [data.name || null, data.short_description || null, id],
    );
    return rows[0] || null;
  },

  delete: async (id: string) => {
    const { rows } = await pool.query<Category>(
      `DELETE FROM categories WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },
};
