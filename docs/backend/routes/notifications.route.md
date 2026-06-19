# `backend/src/routes/notifications.route.ts` — Route notifikasi in-app

## Lokasi file asli
`backend/src/routes/notifications.route.ts`

## Tujuan / peran file ini
Mount handler controller `notifications` di `/api/notifications/*`. Semua endpoint butuh login.

## Daftar route
| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/` | `authenticate` | `getAll` |
| GET | `/unread-count` | `authenticate` | `getUnreadCount` |
| PATCH | `/:id/read` | `authenticate` | `markAsRead` |
| PATCH | `/read-all` | `authenticate` | `markAllAsRead` |
| DELETE | `/:id` | `authenticate` | `remove` |

## Urutan route
Path `/:id/read` punya segmen `:id` dulu sebelum `/read`, jadi tidak konflik dengan path literal `/read-all`. Tetap pertahankan urutan ini saat menambah route baru.

## Dependensi
- `../controllers/notifications.controller`
- `../middlewares/auth.middleware`
- **Di-mount oleh**: `index.ts` di `/api/notifications`.

## Hal yang perlu diperhatikan
- Tidak ada bulk delete — kalau notif menumpuk, user harus hapus satu-satu.
- `/unread-count` di-poll FE per beberapa detik untuk badge — pastikan endpoint ini ringan (cuma `COUNT(*)` di model).
