# `backend/src/routes/location.route.ts` — Route lokasi

## Lokasi file asli
`backend/src/routes/location.route.ts`

## Tujuan / peran file ini
Mount handler controller `location` di bawah `/api/locations/*`. Endpoint `/tree` adalah pintu masuk hierarki nested untuk UI dropdown bertingkat.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/` | — | `getAll` (flat list) |
| GET | `/tree` | — | `getRootsWithChildren` (nested) |
| GET | `/:id` | — | `getById` |
| POST | `/` | `authenticate` | `create` |
| PATCH | `/:id` | `authenticate` | `update` |
| DELETE | `/:id` | `authenticate` | `remove` |

## Urutan route
`/tree` ditaruh **sebelum** `/:id`. Kalau dibalik, Express bakal anggap `tree` sebagai value param `:id` dan handler-nya jadi `getById` — bug klasik.

## Dependensi
- `../controllers/location.controller`
- `../middlewares/auth.middleware`
- **Di-mount oleh**: `index.ts` di `/api/locations`.

## Hal yang perlu diperhatikan
- ⚠ Sama seperti `categories`, CUD tanpa `requireAdmin`. Audit.
- GET endpoints public — mahasiswa yang belum login bisa lihat struktur organisasi. Sengaja atau tidak? Kalau struktur kampus dianggap publik, oke.
