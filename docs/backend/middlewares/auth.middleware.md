# `backend/src/middlewares/auth.middleware.ts` — Cek JWT & role

## Lokasi file asli
`backend/src/middlewares/auth.middleware.ts`

## Tujuan / peran file ini
Middleware Express yang dipakai di route untuk:
- **`authenticate`** — wajib login (cek access token di header `Authorization: Bearer ...`).
- **`requireAdmin`** — wajib role `ADMIN`.
- **`requireRole(...roles)`** — wajib role tertentu (factory).

## Penjelasan per bagian

### `authenticate`
```ts
const authHeader = req.headers.authorization;
if (!authHeader?.startsWith("Bearer ")) {
  return res.status(401).json({ message: "Token tidak ada" });
}
const token = authHeader.split(" ")[1];
try {
  const payload = verifyAccessToken(token);
  (req as any).user = payload;
  next();
} catch {
  return res.status(403).json({ message: "Token tidak valid atau expired" });
}
```
- 401 = tidak ada token sama sekali.
- 403 = token ada tapi tidak valid / expired.
- Payload (id + role) ditempel ke `req.user` supaya controller bisa pakai. Cast `as any` karena Express tidak punya type `user` bawaan di Request.

> Frontend biasanya tangani 403 dengan: coba hit `/api/auth/refresh`, kalau dapat access token baru, retry request asli. Lihat `frontend/src/lib/api.ts`.

### `requireAdmin`
```ts
const user = (req as any).user;
if (!user || user.role !== "ADMIN") {
  return res.status(403).json({ message: "Akses ditolak, hanya admin" });
}
next();
```
Harus dipasang **setelah** `authenticate` (karena dia baca `req.user`). Pola pakainya:
```ts
router.get("/", authenticate, requireAdmin, handler);
```

### `requireRole(...roles)`
Factory function — generate middleware yang accept role apa saja.
```ts
router.get("/my-tasks", authenticate, requireRole("STAFF", "ADMIN"), getMyTasks);
```

## Dependensi
- `../lib/jwt` (`verifyAccessToken`)
- **Dipakai oleh**: hampir semua file di `routes/`.

## Alur request
```
Client → Authorization: Bearer <token>
       → authenticate middleware
            ├─ no/invalid header → 401/403
            └─ valid → req.user = {id, role}, next()
       → (optional) requireAdmin / requireRole
            └─ role tidak cocok → 403
       → controller
```

## Hal yang perlu diperhatikan
- `req.user` di-cast `as any`. Lebih baik bikin global `declare module "express-serve-static-core"` untuk type-safe, tapi cuma kosmetik.
- Tidak ada middleware "optional auth" (cek token kalau ada, lanjut kalau tidak). Kalau ke depan butuh, harus bikin baru.
- Tidak ada whitelist token / blacklist — logout cuma clear cookie. Access token yang sudah di-issue masih valid sampai expired (15 menit). Trade-off normal di JWT stateless.
