# `backend/src/routes/categories.route.ts` — Route kategori

## Lokasi file asli
`backend/src/routes/categories.route.ts`

## Tujuan / peran file ini
Mount handler controller `categories` di bawah `/api/categories/*`.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/` | — | `getAll` |
| GET | `/:id` | — | `getById` |
| POST | `/` | `authenticate` | `create` |
| PATCH | `/:id` | `authenticate` | `update` |
| DELETE | `/:id` | `authenticate` | `remove` |

## Dependensi
- `../controllers/categories.controller`
- `../middlewares/auth.middleware`
- **Di-mount oleh**: `index.ts` di `/api/categories`.

## Hal yang perlu diperhatikan
- ⚠ Route CUD (`create`/`update`/`remove`) cuma minta `authenticate`, tanpa `requireAdmin`. Mahasiswa biasa bisa hapus kategori sistem. Bisa jadi bug.
- GET endpoints public — frontend bisa fetch tanpa login (mis. saat halaman buat laporan).
