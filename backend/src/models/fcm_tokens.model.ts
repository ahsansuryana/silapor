import pool from '../lib/db';

export interface FcmToken {
  id: string;
  user_id: string;
  token: string;
  device_type: string;
  device_name: string | null;
  created_at: Date;
  updated_at: Date;
}

export const FcmTokensModel = {
  findByUserId: async (userId: string) => {
    const { rows } = await pool.query<FcmToken>(
      `SELECT * FROM fcm_tokens WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return rows;
  },

  findByToken: async (token: string) => {
    const { rows } = await pool.query<FcmToken>(
      `SELECT * FROM fcm_tokens WHERE token = $1`,
      [token],
    );
    return rows[0] || null;
  },

  upsert: async (data: {
    user_id: string;
    token: string;
    device_type?: string;
    device_name?: string;
  }) => {
    const { rows } = await pool.query<FcmToken>(
      `INSERT INTO fcm_tokens (user_id, token, device_type, device_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (token)
       DO UPDATE SET user_id = $1, device_type = $3, device_name = $4, updated_at = now()
       RETURNING *`,
      [
        data.user_id,
        data.token,
        data.device_type || 'web',
        data.device_name || null,
      ],
    );
    return rows[0];
  },

  deleteByToken: async (token: string) => {
    const { rows } = await pool.query<FcmToken>(
      `DELETE FROM fcm_tokens WHERE token = $1 RETURNING *`,
      [token],
    );
    return rows[0] || null;
  },

  deleteByUserAndToken: async (userId: string, token: string) => {
    const { rows } = await pool.query<FcmToken>(
      `DELETE FROM fcm_tokens WHERE user_id = $1 AND token = $2 RETURNING *`,
      [userId, token],
    );
    return rows[0] || null;
  },

  deleteByUserId: async (userId: string) => {
    const { rows } = await pool.query<FcmToken>(
      `DELETE FROM fcm_tokens WHERE user_id = $1 RETURNING *`,
      [userId],
    );
    return rows;
  },
};
