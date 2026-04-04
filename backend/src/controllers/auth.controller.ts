import { Request, Response } from "express";
import bcrypt from "bcrypt";
import axios from "axios";
import { UsersModel } from "../models/users.model";
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

// ─── NIM + Password ───────────────────────────────────────

export const register = async (req: Request, res: Response) => {
  const { nim, name, password } = req.body;

  if (!nim || !name || !password)
    return res
      .status(400)
      .json({ message: "NIM, nama, dan password wajib diisi" });

  const existing = await UsersModel.findByNim(nim);
  if (existing) return res.status(409).json({ message: "NIM sudah terdaftar" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await UsersModel.createLocal({ nim, name, password: hashed });

  return res.status(201).json({
    message: "Registrasi berhasil",
    user: { id: user.id, name: user.name },
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

// ─── Google OAuth ─────────────────────────────────────────

export const googleRedirect = (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  // Tukar code → access token Google
  const tokenRes = await axios.post(GOOGLE_TOKEN_URL, {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  // Ambil data user dari Google
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

// ─── Refresh Token ────────────────────────────────────────

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

// ─── Logout ───────────────────────────────────────────────

export const logout = (_req: Request, res: Response) => {
  clearRefreshTokenCookie(res);
  return res.json({ message: "Logout berhasil" });
};
