import pool from "../lib/db";

export type LocationType = "UNIVERSITAS" | "FAKULTAS" | "JURUSAN" | "RUANGAN" | "AREA";

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  parent_id: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export type LocationWithChildren = Location & {
  children: LocationWithChildren[];
};

const buildLocationTree = (items: Location[]): LocationWithChildren[] => {
  const map = new Map<string, LocationWithChildren>();
  const roots: LocationWithChildren[] = [];

  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parent_id === null) {
      roots.push(node);
      return;
    }

    const parent = map.get(item.parent_id);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node); // fallback if parent is missing
    }
  });

  return roots;
};

export const LocationsModel = {
  findById: async (id: string) => {
    const { rows } = await pool.query<Location>(
      `SELECT * FROM locations WHERE id = $1`,
      [id],
    );
    return rows[0] || null;
  },

  findAll: async () => {
    const { rows } = await pool.query<Location>(
      `SELECT * FROM locations ORDER BY name`,
    );
    return rows;
  },

  findByParentId: async (parentId: string) => {
    const { rows } = await pool.query<Location>(
      `SELECT * FROM locations WHERE parent_id = $1 ORDER BY name`,
      [parentId],
    );
    return rows;
  },

  // Returns top-level locations with their full descendant tree.
  // This assumes root nodes are stored with `parent_id IS NULL`.
  findRootsWithChildren: async () => {
    const { rows } = await pool.query<Location>(
      `WITH RECURSIVE location_tree AS (
         SELECT id, name, type, parent_id, created_at, updated_at
         FROM locations
         WHERE parent_id IS NULL

         UNION ALL

         SELECT child.id, child.name, child.type, child.parent_id, child.created_at, child.updated_at
         FROM locations child
         JOIN location_tree parent ON child.parent_id = parent.id
       )
       SELECT * FROM location_tree ORDER BY parent_id NULLS FIRST, name`,
    );

    return buildLocationTree(rows);
  },

  create: async (data: {
    name: string;
    type: LocationType;
    parent_id?: string | null;
  }) => {
    const { rows } = await pool.query<Location>(
      `INSERT INTO locations (name, type, parent_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.type, data.parent_id ?? null],
    );
    return rows[0];
  },

  update: async (
    id: string,
    data: {
      name?: string | null;
      type?: LocationType | null;
      parent_id?: string | null;
    },
  ) => {
    const name = data.name ?? null;
    const type = data.type ?? null;
    const parent_id = data.parent_id ?? null;

    const { rows } = await pool.query<Location>(
      `UPDATE locations
       SET name = COALESCE($1, name),
           type = COALESCE($2, type),
           parent_id = COALESCE($3, parent_id),
           updated_at = now()
       WHERE id = $4
       RETURNING *`,
      [name, type, parent_id, id],
    );

    return rows[0] || null;
  },

  delete: async (id: string) => {
    const { rows } = await pool.query<Location>(
      `DELETE FROM locations WHERE id = $1 RETURNING *`,
      [id],
    );
    return rows[0] || null;
  },

  findStaffInHierarchy: async (locationId: string): Promise<{ id: string; name: string } | null> => {
    let currentLocationId = locationId;
    
    while (currentLocationId) {
      // Cek staff di lokasi ini
      const { rows } = await pool.query<{ id: string; name: string }>(
        `SELECT u.id, u.name
         FROM user_staff_location usl
         JOIN users u ON usl.staff_id = u.id
         WHERE usl.location_id = $1 AND u.role = 'STAFF'
         LIMIT 1`,
        [currentLocationId],
      );
      
      if (rows.length > 0) {
        return rows[0];
      }
      
      // Tidak ada staff, ambil parent
      const parent = await LocationsModel.findById(currentLocationId);
      if (!parent || !parent.parent_id) {
        // Sudah di root, cari staff di root
        const { rows: rootRows } = await pool.query<{ id: string; name: string }>(
          `SELECT u.id, u.name
           FROM user_staff_location usl
           JOIN users u ON usl.staff_id = u.id
           JOIN locations l ON usl.location_id = l.id
           WHERE l.parent_id IS NULL AND u.role = 'STAFF'
           LIMIT 1`,
        );
        return rootRows[0] || null;
      }
      
      currentLocationId = parent.parent_id;
    }
    
    return null;
  },
};
