# `backend/src/routes/users.route.ts` — Route admin: kelola mahasiswa

## Lokasi file asli
`backend/src/routes/users.route.ts`

## Tujuan / peran file ini
Mirip dengan `staff.route.ts`, tapi untuk role MAHASISWA. Handler inline. Endpoint mount di `/api/users/*`.

## Daftar route
| Method | Path | Middleware | Logic singkat |
|---|---|---|---|
| GET | `/` | `authenticate, requireAdmin` | `UsersModel.getAllMahasiswa()` |
| POST | `/` | `authenticate, requireAdmin` | Validasi → cek NIM unik → `createMahasiswa` |
| PUT | `/:id` | `authenticate, requireAdmin` | `updateMahasiswa(id, { name, password })` |
| DELETE | `/:id` | `authenticate, requireAdmin` | `deleteMahasiswa(id)` |

POST cek duplikasi NIM (409) sebelum insert.

## Dependensi
- `UsersModel`
- `../middlewares/auth.middleware`
- **Di-mount oleh**: `index.ts` di `/api/users`.

## Hal yang perlu diperhatikan
- `createMahasiswa` di model hash password sendiri (≠ `createLocal` yang minta hash di controller). Hati-hati saat refactor.
- Tidak ada endpoint `GET /:id` — admin tidak punya cara lihat detail mahasiswa. Mungkin sengaja, mungkin kelewat.
- `deleteMahasiswa` tidak cek apakah mahasiswa punya laporan aktif → laporan jadi orphan reference `reporter_id`.
