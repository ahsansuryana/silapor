import { Request, Response } from "express";
import bcrypt from "bcrypt";
import axios from "axios";
import { UsersModel } from "../models/users.model";
import { FcmTokensModel } from "../models/fcm_tokens.model";
import pool from "../lib/db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../helper/token.helper";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

// ─── NIM + Password ───────────────────────────────

export const updateRole = async (req: Request, res: Response) => {
  const { nim, role } = req.body;

  if (!nim || !role)
    return res.status(400).json({ message: "NIM dan role wajib diisi" });

  if (!["MAHASISWA", "STAFF", "ADMIN"].includes(role))
    return res.status(400).json({ message: "Role tidak valid" });

  const user = await UsersModel.findByNim(nim);
  if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

  const { rows } = await pool.query(
    `UPDATE users SET role = $1 WHERE "NIM" = $2 RETURNING *`,
    [role, nim]
  );

  return res.json({
    message: "Role berhasil diupdate",
    user: { id: rows[0].id, name: rows[0].name, role: rows[0].role }
  });
};

export const register = async (req: Request, res: Response) => {
  const { nim, name, password } = req.body;

  if (!nim || !name || !password)
    return res
      .status(400)
      .json({ message: "NIM, nama, dan password wajib diisi" });

  const existing = await UsersModel.findByNim(nim);
  if (existing) return res.status(409).json({ message: "NIM sudah terdaftar" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await UsersModel.createLocal({ nim, name, password: hashed, role: "MAHASISWA" });

  return res.status(201).json({
    message: "Registrasi berhasil",
    user: { id: user.id, name: user.name },
  });
};

export const registerStaff = async (req: Request, res: Response) => {
  const { nim, name, password, locations } = req.body;

  if (!nim || !name || !password)
    return res
      .status(400)
      .json({ message: "NIM, nama, dan password wajib diisi" });

  const existing = await UsersModel.findByNim(nim);
  if (existing) return res.status(409).json({ message: "NIM sudah terdaftar" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await UsersModel.createLocal({ nim, name, password: hashed, role: "STAFF" });

  if (locations && Array.isArray(locations) && locations.length > 0) {
    const pool = require("../lib/db").default;
    for (const locationId of locations) {
      await pool.query(
        "INSERT INTO user_staff_location (staff_id, location_id) VALUES ($1, $2)",
        [user.id, locationId]
      );
    }
  }

  return res.status(201).json({
    message: "Registrasi staff berhasil",
    user: { id: user.id, name: user.name, role: user.role },
  });
};

export const registerAdmin = async (req: Request, res: Response) => {
  const { nim, name, password } = req.body;

  if (!nim || !name || !password)
    return res
      .status(400)
      .json({ message: "NIM, nama, dan password wajib diisi" });

  const existing = await UsersModel.findByNim(nim);
  if (existing) return res.status(409).json({ message: "NIM sudah terdaftar" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await UsersModel.createLocal({ nim, name, password: hashed, role: "ADMIN" });

  return res.status(201).json({
    message: "Registrasi admin berhasil",
    user: { id: user.id, name: user.name, role: user.role },
  });
};

export const login = async (req: Request, res: Response) => {
  const { nim, password } = req.body;
  const user = await UsersModel.findByNim(nim);
  if (!user)
    return res.status(401).json({ message: "NIM atau password salah" });

  if (user.is_google)
    return res.status(400).json({ message: "Akun ini terdaftar via Google" });

  const valid = await bcrypt.compare(password, user.password!);
  if (!valid)
    return res.status(401).json({ message: "NIM atau password salah" });

  const payload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setRefreshTokenCookie(res, refreshToken);
  return res.json({
    accessToken,
    user: { id: user.id, name: user.name, role: user.role },
  });
};

// ─── Google OAuth ─────────────────────────────────────

export const googleRedirect = (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;
  const tokenRes = await axios.post(GOOGLE_TOKEN_URL, {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });
  const userInfo = await axios.get(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
  });
  const { email, name, picture } = userInfo.data;
  // Cari atau buat user
  let user = await UsersModel.findByEmail(email);
  if (!user) {
    user = await UsersModel.createGoogle({ email, name, avatar_url: picture });
  } else if (!user.is_google) {
    return res.redirect(`${process.env.CLIENT_URL}/login?error=email_exists`);
  }

  const payload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  setRefreshTokenCookie(res, refreshToken);

  // Redirect ke frontend bawa access token
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
};

// ─── Refresh Token ─────────────────────────────────────

export const refresh = (req: Request, res: Response) => {
  const token = req.cookies?.refresh_token;
  if (!token)
    return res.status(401).json({ message: "Refresh token tidak ada" });

  try {
    const payload = verifyRefreshToken(token);
    const accessToken = generateAccessToken({
      id: payload.id,
      role: payload.role,
    });
    return res.json({ accessToken });
  } catch {
    return res.status(403).json({ message: "Refresh token tidak valid" });
  }
};

// ─── Profile ─────────────────────────────────────────────

export const updateProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json({ message: "Nama atau password harus diisi" });
  }

  try {
    const updated = await UsersModel.update(user.id, { name, password });
    if (!updated) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }
    return res.json({
      message: "Profile berhasil diupdate",
      user: { id: updated.id, name: updated.name, role: updated.role },
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Gagal update profile" });
  }
};

// ─── Logout ─────────────────────────────────────────────

export const logout = (_req: Request, res: Response) => {
  clearRefreshTokenCookie(res);
  return res.json({ message: "Logout berhasil" });
};

// ─── FCM Token ─────────────────────────────────────────

export const registerFcmToken = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { token, device_type, device_name } = req.body as {
    token: string;
    device_type?: string;
    device_name?: string;
  };

  if (!token)
    return res.status(400).json({ message: "Token wajib diisi" });

  await FcmTokensModel.upsert({
    user_id: user.id,
    token,
    device_type,
    device_name,
  });

  return res.json({ message: "FCM token berhasil didaftarkan" });
};

export const deleteFcmToken = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { token } = req.body as { token: string };

  if (!token)
    return res.status(400).json({ message: "Token wajib diisi" });

  await FcmTokensModel.deleteByUserAndToken(user.id, token);
  return res.json({ message: "FCM token berhasil dihapus" });
};