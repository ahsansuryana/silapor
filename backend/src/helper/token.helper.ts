import { Response } from "express";

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie("refresh_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
  });
};

export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refresh_token");
};
