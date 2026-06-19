# `backend/src/routes/assignments.route.ts` — Route penugasan staff

## Lokasi file asli
`backend/src/routes/assignments.route.ts`

## Tujuan / peran file ini
Mount handler controller `staff_assignments` di `/api/assignments/*`. Hanya STAFF & ADMIN yang boleh akses (kecuali GET).

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/my-tasks` | `authenticate, requireRole("STAFF","ADMIN")` | `getMyTasks` |
| GET | `/:reportId` | `authenticate` | `getByReportId` |
| GET | `/:reportId/active` | `authenticate` | `getActiveAssignment` |
| POST | `/` | `authenticate, requireRole("STAFF","ADMIN")` | `assign` |
| POST | `/transfer` | `authenticate, requireRole("STAFF","ADMIN")` | `transfer` |
| POST | `/auto-assign` | `authenticate, requireRole("STAFF","ADMIN")` | `autoAssign` |

## Urutan route
`/my-tasks` ada **sebelum** `/:reportId`, supaya `my-tasks` tidak diparse sebagai value `:reportId`.

## Dependensi
- `../controllers/staff_assignments.controller`
- `../middlewares/auth.middleware` (`requireRole`)
- **Di-mount oleh**: `index.ts` di `/api/assignments`.

## Hal yang perlu diperhatikan
- GET `/:reportId` dan `/:reportId/active` cuma `authenticate` — mahasiswa bisa lihat siapa staff yang menangani laporan apa saja. Bisa dianggap fitur transparency, bisa juga dianggap kebocoran data — putuskan sesuai requirement.
