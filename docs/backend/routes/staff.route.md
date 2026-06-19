# `backend/src/routes/staff.route.ts` — Route admin: kelola staff

## Lokasi file asli
`backend/src/routes/staff.route.ts`

## Tujuan / peran file ini
Beda dengan route lain, file ini taruh handler **inline** (tidak ada controller terpisah). Berfungsi untuk admin: list staff + lokasinya, update info staff (nama/password/lokasi), dan hapus staff.

Endpoint mount di `/api/staff/*`.

## Daftar route
| Method | Path | Middleware | Logic singkat |
|---|---|---|---|
| GET | `/` | `authenticate, requireAdmin` | `UsersModel.getStaffWithLocations()` |
| PUT | `/:id` | `authenticate, requireAdmin` | Update nama/password + re-sync mapping lokasi |
| DELETE | `/:id` | `authenticate, requireAdmin` | Hapus staff (model handle delete mapping dulu) |

## Bagian penting: PUT `/:id`
```ts
const updated = await UsersModel.update(id, { name, password });
if (!updated) return res.status(404)...;

if (locations && Array.isArray(locations)) {
  const pool = require("../lib/db").default;
  await pool.query("DELETE FROM user_staff_location WHERE staff_id = $1", [id]);
  for (const locationId of locations) {
    await pool.query("INSERT INTO user_staff_location ...", [id, locationId]);
  }
}
```
- Pattern "delete-all-then-insert" untuk re-sync mapping. Sederhana tapi ada window tidak ada mapping (kalau request lain mau auto-assign, gagal).
- Pakai raw `pool.query` lewat `require` — bypass `UserStaffLocationModel`. Konsisten dengan `auth.controller.registerStaff` yang juga bypass.

## Dependensi
- `UsersModel`
- `../middlewares/auth.middleware`
- raw `pool` lewat require
- **Di-mount oleh**: `index.ts` di `/api/staff`.

## Hal yang perlu diperhatikan
- Tidak transactional → window pendek tanpa mapping selama re-sync.
- Sebaiknya refactor: route → controller terpisah biar konsisten dengan struktur project lain.
- `UsersModel.update` hash password sendiri. Kalau body `password` undefined, model skip — aman.
