# `backend/src/controllers/notifications.controller.ts` — Notifikasi in-app

## Lokasi file asli
`backend/src/controllers/notifications.controller.ts`

## Tujuan / peran file ini
Handle endpoint notifikasi: list, unread count, mark-as-read (single/all), delete. Notif **dibuat** oleh controller lain (saat status berubah, dst) — di sini cuma "view + manage".

## Penjelasan per handler
- **`getAll`**: list notif user (paginated).
- **`getUnreadCount`**: untuk badge angka.
- **`markAsRead(id)`**: cek dulu notif itu memang milik `req.user.id` — kalau bukan, 403 (hindari user mark notif orang lain).
- **`markAllAsRead`**: bulk update semua notif user.
- **`remove`**: cek ownership lalu hapus.

## Dependensi
- `NotificationsModel`
- **Dipanggil oleh**: `routes/notifications.route.ts`.

## Hal yang perlu diperhatikan
- Tidak ada bulk delete / archive.
- Tidak ada filter "by type" — semua notif jadi satu feed.
- Notif tidak punya soft-delete; hapus = hapus permanen.
