# `backend/src/lib/jwt.ts` — Helper JWT (access & refresh token)

## Lokasi file asli
`backend/src/lib/jwt.ts`

## Tujuan / peran file ini
Wrapper tipis di atas library `jsonwebtoken` untuk generate & verify dua jenis token: **access token** (umur pendek) dan **refresh token** (umur panjang).

## Penjelasan per bagian

```ts
export interface JwtPayload {
  id: string;
  role: string;
}
```
Payload-nya minimalis: cuma `id` user dan `role` (MAHASISWA / STAFF / ADMIN). Sengaja kecil supaya token tidak gendut.

```ts
generateAccessToken(payload) → expiresIn: "15m"
generateRefreshToken(payload) → expiresIn: "7d"
```
Pola umum: access token pendek (15 menit) supaya kalau bocor cepat expired; refresh token panjang (7 hari) disimpan di httpOnly cookie agar lebih aman dari XSS.

```ts
verifyAccessToken / verifyRefreshToken
```
Bedanya cuma di secret-nya (`ACCESS_TOKEN_SECRET` vs `REFRESH_TOKEN_SECRET`). Kalau secret beda, refresh token tidak bisa dipakai sebagai access token (atau sebaliknya) — pertahanan defense-in-depth.

## Dependensi
- Library `jsonwebtoken`
- Env vars: `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`
- **Dipakai oleh**: `controllers/auth.controller.ts`, `middlewares/auth.middleware.ts`.

## Alur data
```
login → generateAccessToken + generateRefreshToken
            ↓                          ↓
       di-return ke client     di-set ke cookie httpOnly
   (disimpan di memory FE)

protected request → middleware authenticate → verifyAccessToken → next()

token expired → POST /api/auth/refresh → verifyRefreshToken → generateAccessToken baru
```

## Hal yang perlu diperhatikan
- Secret di-baca via `process.env.X!` (non-null assertion). Kalau env tidak diset, `jwt.sign` akan crash. Pastikan `.env` lengkap.
- `expiresIn` di-hardcode di file ini, tidak baca env `ACCESS_TOKEN_EXPIRES` / `REFRESH_TOKEN_EXPIRES` walau env-nya ada. **Inkonsistensi minor** — kalau mau ubah durasi, edit file ini.
- Algoritma default `jsonwebtoken` adalah HS256. Aman selama secret cukup panjang & random.
